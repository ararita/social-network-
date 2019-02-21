import React from "react";

export default function Logo(props) {
    return (
        <div>
            <img
                className="house-logo"
                alt="by @pitygacio"
                src="/logo-big.png"
                onClick={props.showMusicPlayer}
            />
        </div>
    );
}
