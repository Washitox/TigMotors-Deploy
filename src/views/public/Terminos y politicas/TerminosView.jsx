import React from 'react';
import logo from "../../../assets/images/TigMotors.png";
import { Link } from 'react-router-dom';

import { Section } from './ui/Section';
import { TermTitle } from './ui/TermTitle';
import { TermText } from './ui/TermText';
import { Highlight } from './ui/Highlight';
import { BackToHome } from './ui/BackToHome';

export default function TerminosView() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl w-full text-center">
        <img src={logo} alt="TigMotors logo" className="mx-auto w-32 h-32 object-contain mb-6" />
        <h1 className="text-3xl font-semibold mb-6 animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text text-transparent">
          Términos y Condiciones de TigMotors
        </h1>
        <p className="text-indigo-300">
          A continuación, detallamos los términos y condiciones relacionados con nuestros servicios especializados en soldaduras de blocs y cabezotes.
        </p>

        <Section>
          <TermTitle>Términos de Uso</TermTitle>
          <TermText>
            Al utilizar los servicios de TigMotors, el cliente <Highlight>acepta</Highlight> que los procedimientos de reparación y soldadura se realizarán conforme a los estándares establecidos. La responsabilidad del cliente incluye proporcionar información precisa sobre los daños del bloque o cabezote.
          </TermText>
        </Section>

        <Section>
          <TermTitle>Garantías</TermTitle>
          <TermText>
            Nuestras reparaciones cuentan con una garantía de <Highlight>48 horas</Highlight>, aplicable únicamente si el cliente sigue las recomendaciones proporcionadas por nuestros técnicos. No cubre fallas derivadas de un uso indebido.
          </TermText>
        </Section>

        <Section>
          <TermTitle>Responsabilidad Limitada</TermTitle>
          <TermText>
            TigMotors no será responsable por daños adicionales hacia las piezas que no hayan sido informados previamente. El cliente reconoce que las reparaciones en blocs y cabezotes requieren inspecciones regulares para evitar problemas mayores.
          </TermText>
        </Section>

        <Section>
          <TermTitle>Confidencialidad</TermTitle>
          <TermText>
            Toda la información proporcionada por el cliente será manejada de manera confidencial. TigMotors no compartirá ni divulgará datos personales o técnicos sin previo consentimiento del cliente.
          </TermText>
        </Section>

        <Section>
          <TermTitle>Política de Pago</TermTitle>
          <TermText>
            Los pagos deben realizarse en su totalidad al momento de recibir las piezas reparadas. Las reparaciones comenzarán una vez el ticket esté dentro de la plataforma.
          </TermText>
        </Section>

        <BackToHome />
      </div>
    </section>
  );
}
