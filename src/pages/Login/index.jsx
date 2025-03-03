import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Импортируем иконки "глазика"
import bg from '../../assets/images/bg-login.jpg'; // Импортируем изображение
import logo from '../../assets/images/logo.png'; // Импортируем изображение
import Loading from '../../components/Loading/Loading';
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
    const [showPassword, setShowPassword] = useState(false); // Состояние для отображения пароля
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Выключаем лоадер через 3 секунды
        }, 3000);

        return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
    }, []); 
    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Сбрасываем ошибку перед проверкой

        // Проверка на пустые поля
        if (!username || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        // Здесь можно добавить логику проверки логина и пароля
        if (username === 'admin' && password === 'admin123') {
            navigate('/Admin'); // Перенаправление на домашнюю страницу
        } if (username === 'sklad' && password === 'sklad123') {
            navigate('/warehouse'); // Перенаправление на домашнюю страницу
        }
        else {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 relative"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Затемнение фона */}
            <div className="absolute inset-0 bg-opacity-50"></div>
            {isLoading && <Loading />}
            {/* Левая часть с логотипом */}
            <div className="w-full md:w-1/2  flex items-center justify-center mb-8 md:mb-0 relative z-10">
                <div className="">
                    <img className=' w-[300px]  md:w-[500px]' src={logo} alt="" /> 
                </div>
            </div>

            {/* Правая часть с формой */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative z-10">
                <form
                    onSubmit={handleLogin}
                    className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border-2 border-white/20 relative overflow-hidden"
                >
                    {/* Декоративные линии */}
                    <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none"></div>
                    <div className="absolute inset-4 border-2 border-white/10 rounded-xl pointer-events-none"></div>

                    <h2 className="text-3xl font-bold mb-8 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Вход
                    </h2>
                    <div className="mb-6">
                        <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="username">
                            Логин
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Введите логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:outline-none focus:border-white/40 bg-white/10 text-white placeholder-white/50 transition-all duration-300"
                        />
                    </div>
                    <div className="mb-8 relative">
                        <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="password">
                            Пароль
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'} // Переключаем тип поля
                            id="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:outline-none focus:border-white/40 bg-white/10 text-white placeholder-white/50 transition-all duration-300 pr-12" // Добавляем отступ для иконки
                        />
                        {/* Иконка "глазика" */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)} // Переключаем видимость пароля
                            className="absolute inset-y-0 top-[40%] right-0 pr-3 flex items-center text-white/90 hover:text-white/80 transition-all duration-300"
                            // Позиционируем иконку
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    {error && (
                        <div className="mb-4 p-2 text-center text-red-500  rounded-xl">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full cursor-pointer py-3 px-6 rounded-xl bg-gray-700/90 text-white font-bold hover:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-white/10 transition-all duration-300 border-2 border-gray-600/30 hover:border-gray-600/50 shadow-sm hover:shadow-md active:scale-95"
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}