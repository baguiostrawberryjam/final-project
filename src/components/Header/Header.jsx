
import "./header.css";

function Header({ header }) {
    return (
        <>
            <div className="header-section">
                Hello, {header}
            </div>
        </>
    );
}

export default Header;