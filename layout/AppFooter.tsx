/* eslint-disable @next/next/no-img-element */

const AppFooter = () => {
    return (
        <div className="layout-footer">
            <img src={`/img/logo-geoit-dev.png`} alt="Logo" height="24" className="mr-2" />
            <span className="font-medium">
                © 2024 |{' '}
                <a href="https://geoit.dev/" target="_blank">
                    GeoIT Developer
                </a>
            </span>
        </div>
    );
};

export default AppFooter;
