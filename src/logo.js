import React from "react";

export default function Logo(props) {
    return (
        <div>
            <img
                className={props.className}
                alt="by @pitygacio"
                src="/logo-big.png"
            />
        </div>
    );
}
