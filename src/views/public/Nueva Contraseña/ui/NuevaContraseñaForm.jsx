import { useForm } from 'react-hook-form';
import { Input, Label, Button } from 'keep-react';
import { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Spinner } from 'keep-react';

export default function NuevaContraseñaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState(null); // Manejar mensajes de éxito o error
  const [isError, setIsError] = useState(false); // Identificar si el mensaje es de error
  const [showPassword, setShowPassword] = useState(false); // Alternar visibilidad de contraseña
  const [loading, setLoading] = useState(false); // Manejar el spinner de carga

  const FormError = ({ message }) => (
    <div className="block font-medium text-red-500 text-sm">{message}</div>
  );

  const onSubmit = async (data) => {
    setLoading(true); // Activa el spinner
    setMessage(null); // Limpia mensajes anteriores
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/password/reset`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Si la solicitud es exitosa
      console.log('Contraseña actualizada:', response.data);
      setMessage('Se ha actualizado la contraseña correctamente.');
      setIsError(false); // No es un error
    } catch (error) {
      console.error(
        'Error al actualizar la contraseña:',
        error.response?.data || error.message
      );

      // Si hay un error
      setMessage(
        error.response?.data?.message || 'El token es incorrecto. Intente nuevamente.'
      );
      setIsError(true); // Es un error
    } finally {
      setLoading(false); // Desactiva el spinner
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Nueva Contraseña
            </h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[400px]">
            {loading && (
              <div className="flex justify-center my-4">
                <Spinner /> {/* Spinner de carga */}
              </div>
            )}
            <div className="space-y-5">
              {/* Token */}
              <fieldset className="max-w-md space-y-1">
                <Label htmlFor="token">
                  Token <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Ingrese el token recibido"
                  {...register('token', { required: 'El token es requerido' })}
                  className="bg-gray-800 border-slate-900 text-white"
                />
                {errors.token && <FormError message={errors.token.message} />}
              </fieldset>

              {/* Nueva contraseña */}
              <fieldset className="max-w-md space-y-1">
                <Label htmlFor="newPassword">
                  Nueva Contraseña <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingrese su nueva contraseña"
                    {...register('newPassword', {
                      required: 'La contraseña es requerida',
                      minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
                      maxLength: { value: 50, message: 'Debe tener como máximo 50 caracteres' },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/,
                        message: 'Debe contener una mayúscula, un número y un carácter especial',
                      },
                    })}
                    className="bg-gray-800 border-slate-900 text-white w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && <FormError message={errors.newPassword.message} />}
              </fieldset>
            </div>

            {/* Botón de enviar */}
            <div className="mt-6 space-y-5">
              <Button type="submit" color="success" className="w-full">
                Confirmar Cambio
              </Button>
            </div>
          </form>

          {/* Mensaje de éxito o error */}
          {message && (
            <div
              className={`mt-6 text-center font-medium ${
                isError ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
