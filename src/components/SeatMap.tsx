import { Seat } from '../types/seat';
import { cn } from './ui/utils';

interface SeatMapProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  selectedSeats: string[];
  unavailableSeats?: string[];
  groupSize?: number;
}

export function SeatMap({ 
  seats, 
  onSeatClick, 
  selectedSeats, 
  unavailableSeats = [],
  groupSize = 1 
}: SeatMapProps) {
  const rows = 5;

  const getSeatIcon = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    const isUnavailable = unavailableSeats.includes(seat.id);
    const isTaken = seat.status === 'taken';
    
    return (
      <button
        key={seat.id}
        onClick={() => onSeatClick(seat)}
        disabled={isTaken || isUnavailable}
        className={cn(
          'w-10 h-10 rounded-t-lg border-2 transition-all relative group',
          'flex items-center justify-center text-xs',
          // Available seats - orange
          seat.status === 'available' && !isSelected && !isUnavailable && 'bg-orange-400 border-orange-500 hover:bg-orange-500 hover:scale-110 cursor-pointer',
          // Selected seats - blue
          isSelected && 'bg-blue-500 border-blue-600 text-white scale-110 shadow-lg',
          // Taken seats - grey
          (isTaken || isUnavailable) && 'bg-gray-400 border-gray-500 cursor-not-allowed opacity-60'
        )}
        title={`Row ${seat.row} - Seat ${seat.number}`}
      >
        <span className={cn(
          'opacity-60',
          isSelected && 'opacity-100'
        )}>
          {seat.row}{seat.number}
        </span>
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
          Row {String.fromCharCode(64 + seat.row)}, Seat {seat.number}
          <div className="text-xs text-gray-300">
            {isTaken ? 'Taken' : isUnavailable ? 'Unavailable' : isSelected ? 'Selected' : 'Available'}
          </div>
        </div>
      </button>
    );
  };

  const renderSection = (section: 'left' | 'right') => {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }, (_, rowIndex) => {
          const row = rowIndex + 1;
          const rowSeats = seats.filter(s => s.row === row && s.section === section);
          
          return (
            <div key={`${section}-row-${row}`} className="flex items-center gap-2">
              {/* Row label */}
              <div className="w-8 text-center text-sm text-gray-600 font-mono">
                {String.fromCharCode(64 + row)}
              </div>
              
              {/* Seats */}
              <div className="flex gap-1">
                {rowSeats.map(seat => getSeatIcon(seat))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      {/* Seat map container */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex gap-12 justify-center">
          {/* Left section */}
          {renderSection('left')}
          
          {/* Aisle */}
          <div className="w-8 flex items-center justify-center">
            <div className="h-full w-px bg-gray-300"></div>
          </div>
          
          {/* Right section */}
          {renderSection('right')}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex gap-6 justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-t-lg bg-orange-400 border-2 border-orange-500"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-t-lg bg-blue-500 border-2 border-blue-600"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-t-lg bg-gray-400 border-2 border-gray-500 opacity-60"></div>
          <span className="text-sm">Taken / Unavailable</span>
        </div>
      </div>

      {/* Group info */}
      {groupSize > 1 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200 max-w-md text-center">
          <p className="text-sm text-gray-700">
            <strong>Group Mode:</strong> Rows without {groupSize} consecutive available seats are marked as unavailable
          </p>
        </div>
      )}
    </div>
  );
}
