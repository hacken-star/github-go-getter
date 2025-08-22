import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface University {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  color: string;
  state: string;
}

interface UniversityMapProps {
  onSelectUniversity: (university: University) => void;
}

const mockUniversities: University[] = [
  {
    id: "1",
    name: "University of Jos",
    shortName: "UNIJOS",
    x: 65,
    y: 25,
    color: "whispr-blue",
    state: "Plateau"
  },
  {
    id: "2", 
    name: "Karl-Kumm University",
    shortName: "Karl-Kumm",
    x: 70,
    y: 30,
    color: "whispr-green",
    state: "Plateau"
  },
  {
    id: "3",
    name: "Anan University",
    shortName: "ANAN",
    x: 60,
    y: 35,
    color: "whispr-purple",
    state: "Plateau"
  },
  {
    id: "4",
    name: "Plateau State University",
    shortName: "PLASU",
    x: 55,
    y: 28,
    color: "whispr-pink",
    state: "Plateau"
  },
  {
    id: "5",
    name: "Federal University of Education",
    shortName: "FUE Pankshin",
    x: 75,
    y: 40,
    color: "whispr-orange",
    state: "Plateau"
  },
  {
    id: "6",
    name: "Royal College Of Health",
    shortName: "Royal Shendam",
    x: 68,
    y: 45,
    color: "whispr-teal",
    state: "Plateau"
  },
  {
    id: "7",
    name: "Low Land College Of Health",
    shortName: "Lowland Shendam",
    x: 72,
    y: 50,
    color: "whispr-yellow",
    state: "Plateau"
  },
  {
    id: "8",
    name: "Federal College of Animal Health and Production Technology",
    shortName: "FCAHPT Vom",
    x: 63,
    y: 32,
    color: "whispr-indigo",
    state: "Plateau"
  },
  {
    id: "9",
    name: "Federal College of Forestry",
    shortName: "FCF Jos",
    x: 67,
    y: 27,
    color: "whispr-blue",
    state: "Plateau"
  },
  {
    id: "10",
    name: "Nigerian Institute Of Mining & Geosciences",
    shortName: "NIM Jos",
    x: 69,
    y: 29,
    color: "whispr-green",
    state: "Plateau"
  },
  {
    id: "11",
    name: "Federal College of Land Resources Technology",
    shortName: "FCLRT Jos",
    x: 66,
    y: 33,
    color: "whispr-purple",
    state: "Plateau"
  },
  {
    id: "12",
    name: "College of Health Technology",
    shortName: "CHT Zawan",
    x: 71,
    y: 38,
    color: "whispr-pink",
    state: "Plateau"
  },
  {
    id: "13",
    name: "Federal College of Veterinary and Medical Laboratory Tech",
    shortName: "FCVMLT Vom",
    x: 64,
    y: 31,
    color: "whispr-orange",
    state: "Plateau"
  },
  {
    id: "14",
    name: "Abdullahi Maikano College of Education",
    shortName: "AMCOE Wase",
    x: 58,
    y: 42,
    color: "whispr-teal",
    state: "Plateau"
  }
];

const UniversityMap = ({ onSelectUniversity }: UniversityMapProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredUni, setHoveredUni] = useState<string | null>(null);

  const filteredUniversities = mockUniversities.filter(
    uni => uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           uni.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-map p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Campus Map
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search universities or states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-none shadow-bubble"
          />
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-bubble">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-whispr-teal/20 to-whispr-purple/20 rounded-2xl overflow-hidden">
          {/* Map background with subtle pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-4 w-2 h-2 bg-whispr-blue rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-whispr-pink rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-whispr-green rounded-full animate-pulse delay-700"></div>
          </div>

          {/* University markers */}
          {filteredUniversities.map((university) => (
            <Button
              key={university.id}
              onClick={() => onSelectUniversity(university)}
              onMouseEnter={() => setHoveredUni(university.id)}
              onMouseLeave={() => setHoveredUni(null)}
              variant="ghost"
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-0 h-auto transition-all duration-300 hover:scale-110 ${
                hoveredUni === university.id ? 'z-20' : 'z-10'
              }`}
              style={{ left: `${university.x}%`, top: `${university.y}%` }}
            >
              <div className={`relative p-3 rounded-full bg-whispr-${university.color} shadow-bubble-glow transition-all duration-300 ${
                hoveredUni === university.id ? 'scale-125 shadow-bubble' : ''
              }`}>
                <MapPin className="h-4 w-4 text-white" />
                
                {/* University label */}
                <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                  hoveredUni === university.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}>
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow-bubble text-xs font-medium text-foreground whitespace-nowrap">
                    {university.shortName}
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-white/95 rotate-45"></div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* University List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground mb-4">Universities</h2>
        {filteredUniversities.map((university) => (
          <Button
            key={university.id}
            onClick={() => onSelectUniversity(university)}
            variant="ghost"
            className="w-full justify-start p-4 h-auto bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-2xl shadow-bubble transition-all duration-300 hover:shadow-bubble-glow"
          >
            <div className={`w-4 h-4 rounded-full bg-whispr-${university.color} mr-3 flex-shrink-0`}></div>
            <div className="text-left">
              <div className="font-medium text-foreground">{university.name}</div>
              <div className="text-sm text-muted-foreground">{university.state}</div>
            </div>
          </Button>
        ))}
      </div>

      {searchTerm && filteredUniversities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No universities found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default UniversityMap;