import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const rutina = {
  "Lunes - Piernas": [
    "Hip Thrust - 4x10-12 - 60-90s",
    "Peso Muerto Rumano - 4x10-12 - 60-90s",
    "Prensa Inclinada - 4x12-15 - 60-90s",
    "Hack Squat - 4x10-12 - 60-90s",
    "Extensión de Cuádriceps - 3x12-15 - 45-60s",
    "Abducción de Cadera - 3x15-20 - 30-45s"
  ],
  "Martes - Empuje": [
    "Press Banca - 4x8-10 - 90s",
    "Press Militar - 4x10-12 - 60-90s",
    "Press Inclinado - 3x10-12 - 60-90s",
    "Fondos - 3x10-15 - 60s",
    "Elevaciones Laterales - 3x12-15 - 45-60s",
    "Extensiones Tríceps - 3x12-15 - 45-60s"
  ],
  "Miércoles - Piernas": [
    "Sentadilla con barra - 4x8-10 - 90s",
    "Zancadas caminando - 3x12-14 c/pierna - 60-90s",
    "Sentadilla búlgara - 3x10-12 c/pierna - 60s",
    "Extensión de cuádriceps - 3x12-15 - 45-60s",
    "Curl femoral - 3x12-15 - 60s",
    "Abducción de cadera - 3x15-20 - 30-45s"
  ],
  "Jueves - Tirón": [
    "Jalones o dominadas - 4x8-12 - 60-90s",
    "Remo con barra - 4x10-12 - 60-90s",
    "Remo máquina/polea - 3x12-15 - 60s",
    "Face Pull - 3x15-20 - 45-60s",
    "Curl bíceps - 3x10-12 - 60s",
    "Curl martillo - 3x12-15 - 60s"
  ],
  "Viernes - Piernas": [
    "Peso muerto sumo - 4x10-12 - 90s",
    "Hip thrust con pausa - 3x10-12 - 60-90s",
    "Step-up banco alto - 3x10-12 c/pierna - 60-75s",
    "Peso muerto rígido - 3x12-15 - 60s",
    "Plancha con abducción - 3x30-40s - 30-45s",
    "Abdominales - 3x15-20 - 30s"
  ]
};

export default function RutinaSemana() {
  const [completados, setCompletados] = useState({});
  const [pesos, setPesos] = useState({});
  useEffect(() => {
    const savedCompletados = localStorage.getItem("completados");
    const savedPesos = localStorage.getItem("pesos");
    if (savedCompletados) setCompletados(JSON.parse(savedCompletados));
    if (savedPesos) setPesos(JSON.parse(savedPesos));
  }, []);

  useEffect(() => {
    localStorage.setItem("completados", JSON.stringify(completados));
  }, [completados]);

  useEffect(() => {
    localStorage.setItem("pesos", JSON.stringify(pesos));
  }, [pesos]);

  const toggleCheck = (dia, i) => {
    setCompletados((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [i]: !prev[dia]?.[i]
      }
    }));
  };

  const actualizarPeso = (dia, i, valor) => {
    setPesos((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [i]: valor
      }
    }));
  };

  const resetearProgreso = () => {
    setCompletados({});
    setPesos({});
    localStorage.removeItem("completados");
    localStorage.removeItem("pesos");
  };

  const totalCompletados = Object.values(completados).reduce((acc, dia) => {
    return acc + Object.values(dia || {}).filter(Boolean).length;
  }, 0);

  const totalEjercicios = Object.values(rutina).reduce((acc, dia) => acc + dia.length, 0);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {totalCompletados} de {totalEjercicios} ejercicios completados esta semana
        </div>
        <Button variant="outline" onClick={resetearProgreso}>
          Reiniciar semana
        </Button>
      </div>

      <Tabs defaultValue="Lunes - Piernas" className="w-full">
        <TabsList className="flex flex-wrap justify-start gap-2 mb-4">
          {Object.keys(rutina).map((dia) => (
            <TabsTrigger key={dia} value={dia} className="capitalize">
              {dia}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(rutina).map(([dia, ejercicios]) => (
          <TabsContent key={dia} value={dia}>
            <div className="grid gap-4">
              {ejercicios.map((ejercicio, i) => (
                <Card key={i} className="flex flex-col gap-2 p-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!!completados[dia]?.[i]}
                      onCheckedChange={() => toggleCheck(dia, i)}
                    />
                    <span className="text-sm font-medium">{ejercicio}</span>
                  </div>
                  <Input
                    placeholder="Peso/Notas"
                    value={pesos[dia]?.[i] || ""}
                    onChange={(e) => actualizarPeso(dia, i, e.target.value)}
                  />
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
