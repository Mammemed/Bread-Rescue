import os
import torch
import torch.nn as nn
import pandas as pd
from torchvision import models, transforms
from PIL import Image
import numpy as np
from sklearn.preprocessing import LabelEncoder
from tqdm import tqdm
from torch.utils.data import Dataset, DataLoader
from torchvision.models import resnet18
from torchvision.models import ResNet18_Weights

# === CONFIGURATION ===
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_DIR = "images"
CSV_PATH = "bread_data.csv"
THRESHOLD = 0.6
IMG_TEST = "images/img2.jpg"

# === TRANSFORMATIONS ===
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# === DATASET ===
class BreadDataset(Dataset):
    def __init__(self, csv_file, img_dir, transform=None):
        self.data = pd.read_csv(csv_file)
        self.img_dir = img_dir
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        row = self.data.iloc[idx]
        img_path = os.path.join(self.img_dir, row['filename'])
        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        weight = torch.tensor(row['weight'], dtype=torch.float32)
        count = torch.tensor(row['count'], dtype=torch.float32)
        return image, weight, count

# === MODÈLE DE RÉGRESSION (POIDS & COUNT) ===
class BreadRegressor(nn.Module):
    def __init__(self):
        super().__init__()
        resnet = resnet18(weights=ResNet18_Weights.DEFAULT)
        self.backbone = nn.Sequential(*list(resnet.children())[:-1])
        self.regressor = nn.Linear(resnet.fc.in_features, 2)

    def forward(self, x):
        x = self.backbone(x).view(x.size(0), -1)
        return self.regressor(x)

# === ENTRAÎNEMENT ===
def train_model():
    dataset = BreadDataset(CSV_PATH, IMAGE_DIR, transform)
    loader = DataLoader(dataset, batch_size=4, shuffle=True)
    model = BreadRegressor().to(DEVICE)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    print("=== Entraînement du modèle ===")
    for epoch in range(10):
        total_loss = 0
        for imgs, weights, counts in loader:
            imgs = imgs.to(DEVICE)
            targets = torch.stack([weights, counts], dim=1).to(DEVICE)
            preds = model(imgs)
            loss = criterion(preds, targets)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}/10 - Loss: {total_loss:.4f}")

    torch.save(model.state_dict(), "bread_regression_model.pth")

# === EMBEDDING POUR DÉTECTION TYPE ===
class EmbeddingModel(nn.Module):
    def __init__(self):
        super().__init__()
        resnet = resnet18(weights=ResNet18_Weights.DEFAULT)
        self.backbone = nn.Sequential(*list(resnet.children())[:-1])
        self.backbone.eval()

    def forward(self, x):
        with torch.no_grad():
            emb = self.backbone(x)
            return emb.view(emb.size(0), -1)

def get_embedding(model, image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(DEVICE)
    return model(image).cpu().numpy()[0]

def load_embeddings():
    df = pd.read_csv(CSV_PATH)
    emb_model = EmbeddingModel().to(DEVICE)
    embeddings, labels = [], []
    for _, row in tqdm(df.iterrows(), total=len(df)):
        path = os.path.join(IMAGE_DIR, row["filename"])
        if os.path.exists(path):
            emb = get_embedding(emb_model, path)
            embeddings.append(emb)
            labels.append(row["type"])
    return np.array(embeddings), labels

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# === PRÉDICTION ===
def predict(image_path):
    # Charger modèle poids + nombre
    model = BreadRegressor().to(DEVICE)
    model.load_state_dict(torch.load("bread_regression_model.pth", map_location=DEVICE))
    model.eval()

    # Charger embeddings
    emb_model = EmbeddingModel().to(DEVICE)
    ref_embeddings, ref_labels = load_embeddings()

    # Préparation image
    image = Image.open(image_path).convert("RGB")
    img_tensor = transform(image).unsqueeze(0).to(DEVICE)

    # Embedding pour type
    test_emb = emb_model(img_tensor).cpu().numpy()[0]
    similarities = [cosine_similarity(test_emb, ref) for ref in ref_embeddings]
    max_idx = int(np.argmax(similarities))
    max_sim = similarities[max_idx]

    # Si inconnu
    if max_sim < THRESHOLD:
        print("❌ Ce n'est pas un type de pain connu (similarité trop faible)")
        return

    # Prédiction Poids / Nombre
    output = model(img_tensor).cpu().detach().numpy()[0]
    predicted_weight = round(float(output[0]), 2)
    predicted_count = int(round(output[1]))

    print("✅ Type détecté :", ref_labels[max_idx])
    print("📦 Poids estimé :", predicted_weight, "kg")
    print("🔢 Nombre estimé :", predicted_count)

# === MAIN ===
if __name__ == "__main__":
    train_model()
    print("\n=== Prédiction pour :", IMG_TEST)
    predict(IMG_TEST)
