import { useState, useEffect } from 'react';
import { Seat, QueueUser } from '../types/seat';
import { Group } from '../types/group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Stage } from './Stage';
import { SeatMap } from './SeatMap';
import { QueueWaitingRoom } from './QueueWaitingRoom';
import { Users, CheckCircle2 } from 'lucide-react';

interface SeatSelectionProps {
  group: Group | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

// Generate initial seats with some already taken
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 5;
  const seatsPerSection = 10;
  
  // Randomly mark some seats as taken
  const takenSeats = new Set([
    'left-1-3', 'left-1-4', 'left-1-5',
    'right-2-1', 'right-2-2',
    'left-3-7', 'left-3-8', 'left-3-9',
    'right-4-5', 'right-4-6', 'right-4-7', 'right-4-8',
    'left-5-2', 'left-5-3',
  ]);
  
  ['left', 'right'].forEach((section) => {
    for (let row = 1; row <= rows; row++) {
      for (let seatNum = 1; seatNum <= seatsPerSection; seatNum++) {
        const id = `${section}-${row}-${seatNum}`;
        seats.push({
          id,
          row,
          number: seatNum,
          section: section as 'left' | 'right',
          status: takenSeats.has(id) ? 'taken' : 'available'
        });
      }
    }
  });
  
  return seats;
};

// Check if there are N consecutive available seats in a row
const hasConsecutiveSeats = (seats: Seat[], row: number, section: 'left' | 'right', count: number): boolean => {
  const rowSeats = seats
    .filter(s => s.row === row && s.section === section)
    .sort((a, b) => a.number - b.number);
  
  let consecutive = 0;
  for (const seat of rowSeats) {
    if (seat.status === 'available') {
      consecutive++;
      if (consecutive >= count) return true;
    } else {
      consecutive = 0;
    }
  }
  return false;
};

// Find consecutive seats starting from a given seat
const findConsecutiveSeats = (seats: Seat[], startSeat: Seat, count: number): Seat[] => {
  const rowSeats = seats
    .filter(s => s.row === startSeat.row && s.section === startSeat.section && s.status === 'available')
    .sort((a, b) => a.number - b.number);
  
  const startIndex = rowSeats.findIndex(s => s.id === startSeat.id);
  if (startIndex === -1) return [];
  
  const consecutiveSeats: Seat[] = [startSeat];
  
  for (let i = startIndex + 1; i < rowSeats.length && consecutiveSeats.length < count; i++) {
    if (rowSeats[i].number === rowSeats[i - 1].number + 1) {
      consecutiveSeats.push(rowSeats[i]);
    } else {
      break;
    }
  }
  
  return consecutiveSeats.length === count ? consecutiveSeats : [];
};

// Generate mock queue users
const generateQueueUsers = (currentPosition: number): QueueUser[] => {
  const users: QueueUser[] = [];
  const names = ['Alex Kim', 'Jordan Lee', 'Sam Park', 'Taylor Choi', 'Morgan Yoon'];
  
  for (let i = 1; i <= 15; i++) {
    users.push({
      position: i,
      userId: `user-${i}`,
      name: i === currentPosition ? 'You' : names[i % names.length] + ` (${i})`,
      isActive: i === 1
    });
  }
  
  return users;
};

export function SeatSelection({ group, isOpen, onClose, onComplete }: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [queuePosition, setQueuePosition] = useState(5);
  const [timeUntilOpen, setTimeUntilOpen] = useState(30);
  const [isInQueue, setIsInQueue] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [queueUsers, setQueueUsers] = useState<QueueUser[]>(generateQueueUsers(5));

  const groupSize = group ? group.members.length : 1;

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setSeats(generateSeats());
      setSelectedSeats([]);
      setQueuePosition(Math.floor(Math.random() * 10) + 1);
      setTimeUntilOpen(30);
      setIsInQueue(true);
      setIsComplete(false);
    }
  }, [isOpen]);

  // Queue timer
  useEffect(() => {
    if (!isOpen || !isInQueue) return;

    const interval = setInterval(() => {
      setTimeUntilOpen(prev => {
        if (prev <= 1) {
          setIsInQueue(false);
          return 0;
        }
        return prev - 1;
      });

      setQueuePosition(prev => {
        if (prev > 1) {
          const newPos = prev - 1;
          setQueueUsers(generateQueueUsers(newPos));
          return newPos;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, isInQueue]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'taken') return;

    if (groupSize === 1) {
      // Individual selection
      setSelectedSeats([seat.id]);
    } else {
      // Group selection - need consecutive seats
      const consecutiveSeats = findConsecutiveSeats(seats, seat, groupSize);
      if (consecutiveSeats.length === groupSize) {
        setSelectedSeats(consecutiveSeats.map(s => s.id));
      }
    }
  };

  const handleConfirmSeats = () => {
    if (selectedSeats.length === 0) return;
    setIsComplete(true);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 2000);
  };

  // Get unavailable seats for groups (rows without enough consecutive seats)
  const getUnavailableSeatsForGroup = (): string[] => {
    if (groupSize === 1) return [];
    
    const unavailable: string[] = [];
    
    for (let row = 1; row <= 5; row++) {
      ['left', 'right'].forEach((section) => {
        if (!hasConsecutiveSeats(seats, row, section as 'left' | 'right', groupSize)) {
          // Mark all available seats in this row as unavailable
          seats
            .filter(s => s.row === row && s.section === section && s.status === 'available')
            .forEach(s => unavailable.push(s.id));
        }
      });
    }
    
    return unavailable;
  };

  const unavailableForGroup = getUnavailableSeatsForGroup();
  const selectedSeatObjects = seats.filter(s => selectedSeats.includes(s.id));

  // Show queue if still in queue
  if (isInQueue) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Ticket Queue</DialogTitle>
            <DialogDescription>
              Please wait in the queue for your turn to select seats
            </DialogDescription>
          </DialogHeader>
          <QueueWaitingRoom
            queuePosition={queuePosition}
            totalInQueue={queueUsers.length}
            timeUntilOpen={timeUntilOpen}
            queueUsers={queueUsers}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Show completion screen
  if (isComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reservation Complete</DialogTitle>
            <DialogDescription>Your seats have been successfully reserved</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="mb-2">Seats Reserved!</h3>
            <p className="text-gray-600 mb-4">
              Confirmation has been sent to your student email.
            </p>
            {group && (
              <div className="bg-purple-50 rounded-lg p-4 text-sm">
                <p className="mb-2">
                  <strong>Group:</strong> {group.leader.name}'s Group
                </p>
                <p className="text-gray-600">
                  {group.members.map(m => m.name).join(', ')}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show seat selection
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Your Seats</DialogTitle>
          <DialogDescription>
            {group 
              ? `Selecting ${groupSize} consecutive seats for ${group.leader.name}'s group` 
              : 'Choose your preferred seat from the seating chart below'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Group Info */}
          {group && (
            <Card className="bg-purple-50 border-purple-200 p-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="mb-2">Group Reservation</h4>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Leader:</strong> {group.leader.name} (Grade {group.leader.grade}-{group.leader.class})
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Members:</strong> {group.members.map(m => m.name).join(', ')}
                  </div>
                  <Badge className="bg-purple-600">
                    {groupSize} consecutive seats required
                  </Badge>
                </div>
              </div>
            </Card>
          )}

          {/* Stage and Seat Map */}
          <div>
            <Stage />
            <SeatMap 
              seats={seats}
              onSeatClick={handleSeatClick}
              selectedSeats={selectedSeats}
              unavailableSeats={unavailableForGroup}
              groupSize={groupSize}
            />
          </div>

          {/* Selected seats summary */}
          {selectedSeats.length > 0 && (
            <Card className="bg-blue-50 border-blue-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="mb-2">
                    Selected Seats ({selectedSeats.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeatObjects.map(seat => (
                      <Badge 
                        key={seat.id} 
                        variant="secondary"
                        className="bg-blue-600 text-white"
                      >
                        {seat.section === 'left' ? 'L' : 'R'}-
                        {String.fromCharCode(64 + seat.row)}{seat.number}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleConfirmSeats}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Confirm Seats
                </Button>
              </div>
            </Card>
          )}

          {selectedSeats.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">
                {group 
                  ? `Click on any available seat to select ${groupSize} consecutive seats in that row` 
                  : 'Click on an available seat to select it'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
