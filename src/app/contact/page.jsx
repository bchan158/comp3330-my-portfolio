import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center bg-stone-50 font-sans dark:bg-black my-4">
      <Card className="w-full max-w-2xl m-4 p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Get in Touch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}

