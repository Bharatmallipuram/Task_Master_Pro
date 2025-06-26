import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="px-6 py-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Today's Progress</h3>
          <span className="text-sm text-gray-600">
            {completed} of {total} completed
          </span>
        </div>
        <Progress value={percentage} className="w-full" />
      </div>
    </div>
  );
}
