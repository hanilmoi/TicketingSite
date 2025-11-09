import { QueueUser } from '../types/seat';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Clock, Users } from 'lucide-react';

interface QueueWaitingRoomProps {
  queuePosition: number;
  totalInQueue: number;
  timeUntilOpen: number; // seconds
  queueUsers: QueueUser[];
}

export function QueueWaitingRoom({ 
  queuePosition, 
  totalInQueue, 
  timeUntilOpen,
  queueUsers 
}: QueueWaitingRoomProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalInQueue - queuePosition) / totalInQueue) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="mb-2">Ticket Queue</h1>
          <p className="text-gray-600">
            Please wait for your turn to select seats
          </p>
        </div>

        {/* Queue position */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 mb-6">
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">Your Position</div>
            <div className="text-6xl mb-2">#{queuePosition}</div>
            <div className="text-sm opacity-90">of {totalInQueue} people in queue</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Queue Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Time until open */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-sm text-gray-600 mb-1">Time Until Your Turn</div>
            <div className="text-2xl text-purple-600">{formatTime(timeUntilOpen)}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-gray-600 mb-1">People Ahead</div>
            <div className="text-2xl text-blue-600">{queuePosition - 1}</div>
          </div>
        </div>

        {/* Queue list */}
        <div>
          <h3 className="mb-3 text-sm">Current Queue</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {queueUsers.slice(0, 10).map((user) => (
                <div 
                  key={user.userId}
                  className={cn(
                    'flex items-center justify-between p-2 rounded',
                    user.isActive && 'bg-green-100 border border-green-300',
                    user.position === queuePosition && 'bg-blue-100 border border-blue-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                      {user.position}
                    </div>
                    <span className="text-sm">{user.name}</span>
                  </div>
                  {user.isActive && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                      Selecting
                    </span>
                  )}
                  {user.position === queuePosition && !user.isActive && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info message */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> Don't refresh the page or you'll lose your spot in queue!
          </p>
        </div>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
