import { Link } from 'react-router-dom';

export const BackToHome = () => (
  <Link
    to="/"
    className="mt-8 inline-block text-lg font-medium text-indigo-500 underline hover:text-indigo-400"
  >
    Regresar al inicio
  </Link>
);
