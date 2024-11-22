import { Globe, MessageCircle, BookOpen } from "lucide-react";
import Card from "./Card";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Globe className="w-12 h-12 text-[#FF4B26]" />,
      title: "Smart Program Matching",
      description:
        "Get personalized university and program recommendations based on your profile and preferences.",
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-[#FF4B26]" />,
      title: "24/7 Virtual Counseling",
      description:
        "Connect with our AI counselor anytime for instant guidance and support.",
    },
    {
      icon: <BookOpen className="w-12 h-12 text-[#FF4B26]" />,
      title: "Comprehensive Resources",
      description:
        "Access detailed information about programs, universities, and application processes.",
    },
  ];

  return (
    <div className="py-16 text-gray-900">
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
