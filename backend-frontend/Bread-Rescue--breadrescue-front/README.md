# 🥖 BreadRescue - Fight Bread Waste and Reward the Community

## 🌱 Introduction

BreadRescue aims to reduce bread waste and promote community solidarity. In France alone, 150,000 tons of bread are wasted every year, equivalent to 10% of production. BreadRescue transforms these wasted loaves into measurable impact, creating a virtuous cycle that benefits local communities, bakeries, and the environment.

---

## 📊 Key Statistics

* **150,000 tons of bread** wasted every year in France.
* Equivalent to **9 baguettes per person** annually.
* BreadRescue converts these losses into measurable, real-time impact using Hedera blockchain.

Source: Too Good To Go - Boulangerie

## 🥇 BreadTokens (BT) - Reward System

| Element          | Description                                                                                                                   | Validation / Safeguards                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Base Reward**  | 5 BT for the bakery + 5 BT for the volunteer. Each BT represents 1 kg of saved bread.                                         | Transfer conditioned by a scheduled transaction on Hedera.   |
| **Speed Bonus**  | +1 BT for each 15-minute time saved between CLAIMED and DELIVERED (max 3 BT). Formula: bonus = max(0, 3 - ceil(Δt / 15 min)). | Calculated by the backend before scheduling the transaction. |
| **Traceability** | Timestamped with HCS (< 5 s) for undisputable event logging.                                                                  | Image verification by AI to prevent fraud.                   |

---

## 💡 Why BreadRescue?

* **Unforgeable Traceability** - Every key event is timestamped and signed on Hedera.
* **Trustless Automation** - Rewards are triggered automatically without manual intervention.
* **Community Transparency** - All transactions are public and verifiable.
