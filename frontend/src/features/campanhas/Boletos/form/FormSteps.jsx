import { useState } from 'react';
import StepBasicInfo from './StepBasicInfo';
import StepMessages from './StepMessages';
import StepScheduling from './StepScheduling';
import StepReview from './StepReview';
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Informações Básicas", component: StepBasicInfo },
  { title: "Definir a mensagem que será enviada", component: StepMessages },
  { title: "Anexos extras", component: StepScheduling },
  { title: "Revisão", component: StepReview },
];

export default function FormSteps({ formData, handleInputChange, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentComponent = steps[currentStep].component;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
      <CurrentComponent formData={formData} handleInputChange={handleInputChange} />
      <div className="flex justify-between mt-6">
        <Button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        >
          Anterior
        </Button>
        <Button 
          onClick={nextStep} 
          disabled={currentStep === steps.length - 1}
          className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}