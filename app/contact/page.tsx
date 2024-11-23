import { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Glovera",
  description:
    "Get in touch with our team for any questions about international education",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions about our programs or need assistance? Our team
                is here to help you on your educational journey.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ContactForm />
        </div>
      </main>
    </div>
  );
}
