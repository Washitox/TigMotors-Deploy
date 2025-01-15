import React from 'react';
import logo from "../../../assets/images/TigMotors.png";
import { Link } from 'react-router-dom';

import { Section } from './ui/Section';
import { TermTitle } from './ui/TermTitle';
import { TermText } from './ui/TermText';
import { Highlight } from './ui/Highlight';
import { BackToHome } from './ui/BackToHome';

export default function PoliticaPrivacidadView() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl w-full text-center">
        <img src={logo} alt="TigMotors logo" className="mx-auto w-32 h-32 object-contain mb-6" />
        <h1 className="text-3xl font-semibold mb-6 animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text text-transparent">
          Política de Privacidad de TigMotors
        </h1>
        <p className="text-indigo-300">
          Conoce cómo TigMotors recopila, utiliza y protege tu información personal al acceder a nuestros servicios.
        </p>

        <Section>
          <TermTitle>Recopilación de Información</TermTitle>
          <TermText>
            TigMotors recopila información personal como tu nombre, correo electrónico, número de teléfono, y detalles sobre las piezas redactadas para poder brindarte servicios de reparación especializados. Esta información es <Highlight>recopilada con tu consentimiento explícito</Highlight>.
          </TermText>
        </Section>

        <Section>
          <TermTitle>Uso de la Información</TermTitle>
          <TermText>
            Los datos personales recopilados son utilizados para:
            <ul className="list-disc text-left pl-8 mt-2">
              <li>Procesar solicitudes de reparación de blocs y cabezotes.</li>
              <li>Enviar actualizaciones sobre el estado y pagos del Ticket.</li>
              <li>Proporcionar recomendaciones técnicas personalizadas.</li>
            </ul>
          </TermText>
        </Section>

        <Section>
          <TermTitle>Protección de la Información</TermTitle>
          <TermText>
            Implementamos medidas de seguridad avanzadas para proteger tus datos, como el uso de <Highlight>cifrado SSL</Highlight> en nuestras plataformas y sistemas internos. TigMotors nunca compartirá tu información personal con terceros sin tu consentimiento.
          </TermText>
        </Section>

        <Section>
          <TermTitle>Tus Derechos</TermTitle>
          <TermText>
            Como cliente, tienes derecho a:
            <ul className="list-disc text-left pl-8 mt-2">
              <li>Acceder a tus datos personales.</li>
              <li>Solicitar la rectificación de las piezas.</li>
              <li>Limitar el procesamiento de tu información.</li>
            </ul>
            Para ejercer estos derechos, contáctanos a través de nuestro correo oficial <Highlight>tigmotors.inc.uio@gmail.com</Highlight>.
          </TermText>
        </Section>

        <Section>
          <TermTitle>Cambios en la Política</TermTitle>
          <TermText>
            Esta política de privacidad puede actualizarse periódicamente. Te recomendamos revisar esta página regularmente para estar al tanto de cualquier cambio.
          </TermText>
        </Section>

        <BackToHome />
      </div>
    </section>
  );
}
