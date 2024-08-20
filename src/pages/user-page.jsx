import { FooterComponent } from "../components/_footer";
import "../../public/css/style.css";
import { HeaderComponent } from "../components/_header";
import { MainComponent } from "../components/_main";

export const UserPage = () => {
    return (
        <div className="modal-container flex flex-col min-h-screen">
            <HeaderComponent />
            <main className="flex-grow">
                <MainComponent />
            </main>
            <FooterComponent />
        </div>
    );
};
