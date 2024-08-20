export const FooterComponent = () => {
    return(
        <footer className="bg-blue-900 text-blue-100 py-4">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold">FalaFácil</h3>
                        <p className="text-sm">© 2024 Todos os direitos reservados</p>
                    </div>
                    <div>
                        {/* <nav className="space-x-4">
                            <a href="#" className="text-blue-300 hover:text-blue-500">Home</a>
                            <a href="#" className="text-blue-300 hover:text-blue-500">Sobre</a>
                            <a href="#" className="text-blue-300 hover:text-blue-500">Contato</a>
                        </nav> */}
                    </div>
                </div>
            </div>
        </footer>
    )
}