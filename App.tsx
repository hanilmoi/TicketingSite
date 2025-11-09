import { useState } from 'react';
import { SeatSelection } from './components/SeatSelection';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card, CardContent } from './components/ui/card';
import { Calendar, MapPin, Clock, Users, School } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Group, sampleGroups } from './types/group';

export default function App() {
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const festival = {
    title: '한일 예술제 2025',
    date: '2025년 12월 ',
    time: '14:00 - 18:00',
    venue: '한일고등학교 무성관',
    location: '충청남도 공주시',
    image: 'https://images.unsplash.com/photo-1623093018048-87079f9bc70f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBhdWRpdG9yaXVtJTIwc3RhZ2V8ZW58MXx8fHwxNzYyNjg0Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };

  const handleJoinQueue = (group: Group | null = null) => {
    setSelectedGroup(group);
    setIsSelectionOpen(true);
  };

  const handleReservationComplete = () => {
    toast.success('Seats reserved successfully! Check your student email for confirmation.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900">
      <Toaster />
      
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <School className="w-8 h-8 text-blue-400" />
            <div className="text-center">
              <h1 className="text-white text-xl">Hanil High School</h1>
              <p className="text-blue-300 text-xs">Festival Seat Reservation System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-blue-900"></div>
          <ImageWithFallback 
            src={festival.image}
            alt={festival.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-lg px-4 py-2">
                <School className="w-4 h-4 mr-2" />
                School Festival
              </Badge>
              
              <h1 className="mb-4 text-white text-5xl md:text-7xl drop-shadow-2xl">
                {festival.title}
              </h1>
              
              <p className="text-2xl mb-8 text-blue-100 drop-shadow-lg max-w-3xl mx-auto">
                Reserve your seats for the annual Hanil Festival. Join the queue to select your preferred seating.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-lg">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(festival.date)}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Clock className="w-5 h-5" />
                  <span>{festival.time}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                  <MapPin className="w-5 h-5" />
                  <span>{festival.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Options */}
      <section className="py-16 bg-gradient-to-b from-blue-900 to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-white mb-4">Reserve Your Seats</h2>
              <p className="text-blue-200 text-xl">Choose to reserve individually or with a group</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Individual Reservation */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white mb-2">Individual</h3>
                    <p className="text-blue-200 text-sm">Reserve a single seat</p>
                  </div>
                  <Button 
                    onClick={() => handleJoinQueue(null)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Join Queue
                  </Button>
                </CardContent>
              </Card>

              {/* Group Reservation Info */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white mb-2">Group Reservation</h3>
                    <p className="text-blue-200 text-sm">Reserve consecutive seats for your group</p>
                  </div>
                  <div className="text-blue-100 text-sm mb-4">
                    <p className="mb-2">• Groups must sit in consecutive seats</p>
                    <p className="mb-2">• Only rows with enough consecutive seats will be available</p>
                    <p>• Group leader enters queue on behalf of all members</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registered Groups */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <h3 className="text-white mb-6">Registered Groups</h3>
                <div className="space-y-4">
                  {sampleGroups.map((group) => (
                    <div 
                      key={group.id}
                      className="bg-black/20 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-white mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Group Leader: {group.leader.name}</span>
                          <Badge variant="outline" className="text-xs bg-blue-600/30 border-blue-400">
                            Grade {group.leader.grade}-{group.leader.class}
                          </Badge>
                        </div>
                        <div className="text-blue-200 text-sm">
                          Members: {group.members.map(m => m.name).join(', ')}
                        </div>
                        <div className="text-blue-300 text-xs mt-1">
                          {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleJoinQueue(group)}
                        variant="outline"
                        className="bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
                      >
                        Join Queue
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <h3 className="text-white mb-6 text-center">How It Works</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl">
                      1
                    </div>
                    <h4 className="text-white mb-2 text-sm">Join Queue</h4>
                    <p className="text-blue-200 text-sm">
                      Enter the queue and wait for your turn
                    </p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl">
                      2
                    </div>
                    <h4 className="text-white mb-2 text-sm">Select Seats</h4>
                    <p className="text-blue-200 text-sm">
                      Choose your preferred seats when it's your turn
                    </p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl">
                      3
                    </div>
                    <h4 className="text-white mb-2 text-sm">Get Confirmation</h4>
                    <p className="text-blue-200 text-sm">
                      Receive confirmation via your student email
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm text-gray-300 py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <School className="w-5 h-5 text-blue-400" />
            <span className="text-white">Hanil High School</span>
          </div>
          <p className="text-sm">&copy; 2025 Hanil Festival. All rights reserved.</p>
        </div>
      </footer>

      {/* Seat Selection */}
      <SeatSelection
        group={selectedGroup}
        isOpen={isSelectionOpen}
        onClose={() => setIsSelectionOpen(false)}
        onComplete={handleReservationComplete}
      />
    </div>
  );
}
