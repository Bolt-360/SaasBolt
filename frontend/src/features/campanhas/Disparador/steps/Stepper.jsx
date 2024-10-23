import { cn } from "@/lib/utils"

export default function Stepper({ currentStep, steps }) {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            currentStep === index ? "bg-blue-500 text-white" : "bg-gray-300"
          )}>
            {index + 1}
          </div>
          <p className="mt-2 text-sm">{step.title}</p>
        </div>
      ))}
    </div>
  )
}