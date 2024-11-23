import { Metadata } from "next";
import { Clock, Video, BookOpen, MessageCircle } from "lucide-react";
import GetStartedForm from "@/components/get-started/GetStartedForm";

export const metadata: Metadata = {
  title: "Get Started | Glovera",
  description:
    "Start your international education journey with a free consultation",
};

export default function GetStarted() {
  const benefits = [
    {
      icon: <Video className="w-6 h-6 text-[#FF4B26]" />,
      title: "AI-Powered Video Chat",
      description:
        "Connect with our intelligent video bot for instant guidance",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#FF4B26]" />,
      title: "Personalized Program Matching",
      description: "Get tailored program recommendations based on your profile",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#FF4B26]" />,
      title: "24/7 Availability",
      description: "Access counseling support whenever you need it",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#FF4B26]" />,
      title: "Expert Guidance",
      description:
        "Receive comprehensive support throughout your application journey",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Start Your Educational Journey
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Schedule a free consultation with our AI counselor and get
              personalized program recommendations.
            </p>
            <GetStartedForm />
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Why Choose Glovera?</h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-1 mr-4">{benefit.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF4B26]">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF4B26]">10k+</div>
                <div className="text-gray-600">Students Helped</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
