import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Users, ArrowUpRight } from "lucide-react";
import BreadIcon from "./icons/BreadIcon";

const RewardSystem = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-bread-800 mb-4">
            Système de récompenses
          </h2>
          <p className="text-muted-foreground">
            Gagnez des points en sauvant du pain et débloquez des récompenses exclusives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-bread-100">
                  <BreadIcon className="h-6 w-6 text-bread-600" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-bread-500" />
              </div>
              <CardTitle>500g de pain sauvé</CardTitle>
              <CardDescription>Progrès actuel</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={45} max={100} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                Encore 550g pour débloquer la prochaine récompense.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-bread-100">
                  <Award className="h-6 w-6 text-bread-600" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-bread-500" />
              </div>
              <CardTitle>Récompenses débloquées</CardTitle>
              <CardDescription>Vos succès</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bread-800">3</div>
              <p className="text-sm text-muted-foreground">
                Continuez à sauver du pain pour en débloquer plus.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-bread-100">
                  <Users className="h-6 w-6 text-bread-600" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-bread-500" />
              </div>
              <CardTitle>Impact communautaire</CardTitle>
              <CardDescription>Ensemble, nous faisons la différence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bread-800">42kg</div>
              <p className="text-sm text-muted-foreground">
                C'est la quantité totale de pain sauvée par la communauté ce mois-ci.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RewardSystem;
