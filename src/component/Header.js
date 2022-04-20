const Header = () => {
    return(
        <div className='header_container'>
            <a target="_blank" href='https://github.com/ZachChang/viz-diary-web'>VizDiary - v1.1.0-alpha</a>
            {/* CRUDE IMPLEMENTATION FOR RESET FEATURE */}
            {/* <button className="btn_container btn_delete" onClick={() => {
                localStorage.removeItem('viz-diary-data');
                localStorage.removeItem('viz-diary-config');
                window.location.reload();
            }}>Reset</button> */}
        </div>
    )
}

export default Header;