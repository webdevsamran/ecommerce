import Navbar from './Navbar';
import Toast from './Toast';

export default function Layout({ children }) {
    return (
        <>
            <Toast />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />
                {children}
            </div>
        </>
    );
}
