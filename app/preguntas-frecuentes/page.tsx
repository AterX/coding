import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Preguntas Frecuentes</h1>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Cómo puedo crear una cuenta?</AccordionTrigger>
            <AccordionContent>
              Para crear una cuenta, haz clic en el botón &quot;Registro&quot; en la barra de navegación y sigue las instrucciones. Necesitarás proporcionar un correo electrónico válido y crear una contraseña segura.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>¿Cómo puedo publicar un proyecto?</AccordionTrigger>
            <AccordionContent>
              Una vez que hayas iniciado sesión, ve a la sección de &quot;Proyectos&quot; y haz clic en el botón &quot;Crear Proyecto&quot;. Completa el formulario con los detalles de tu proyecto y envíalo para revisión.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>¿Cómo puedo contactar con el soporte?</AccordionTrigger>
            <AccordionContent>
              Puedes contactar con nuestro equipo de soporte a través del formulario de contacto en la sección de &quot;Contacto&quot; o enviando un correo electrónico directamente a nuestro equipo de soporte.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>¿Cómo funciona el sistema de colaboración?</AccordionTrigger>
            <AccordionContent>
              Nuestro sistema de colaboración permite a los usuarios conectarse con otros profesionales y trabajar juntos en proyectos. Puedes buscar colaboradores basándote en sus habilidades y experiencia, y enviarles invitaciones para colaborar.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>¿Qué tipos de proyectos puedo publicar?</AccordionTrigger>
            <AccordionContent>
              Puedes publicar cualquier tipo de proyecto profesional que requiera colaboración. Esto incluye proyectos de desarrollo de software, diseño, marketing, investigación, y más. Asegúrate de que tu proyecto cumpla con nuestras directrices comunitarias.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  )
}