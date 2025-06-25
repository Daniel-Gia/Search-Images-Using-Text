interface InstructionStep {
  number: number;
  title: string;
  description: string;
}

interface InstructionsProps {
  title: string;
  steps: InstructionStep[];
}

export default function Instructions({ title, steps }: InstructionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 mt-8">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {steps.map((step) => (
          <div key={step.number} className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-blue-600 font-bold text-lg">{step.number}</span>
            </div>
            <h3 className="font-semibold text-blue-900">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
