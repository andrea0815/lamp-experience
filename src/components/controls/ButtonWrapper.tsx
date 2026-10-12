import type { ReactNode } from "react";
import React from "react";

type ButtonWrapperProps = {
    children: ReactNode;
    midSection?: boolean;
    keys?: string[];
    padding?: string;
    contentHeight?: string;
    gap?: string;
    disabled?: boolean;
};

function ButtonWrapper({
    children,
    midSection = true,
    keys = [],
    padding = "5px 8px",
    contentHeight = "40px",
    gap = "0px",
    disabled = false,
}: ButtonWrapperProps) {
    return (
        <div
            className={`flex flex-col items-end gap-1 transition-opacity duration-300 ${disabled ? "opacity-30" : "opacity-100"}`}
            aria-disabled={disabled}
        >
            <div className="relative inline-flex w-fit text-beige-400">
                <div
                    className="relative z-10 box-content flex w-fit items-center justify-center text-center text-md font-smythe"
                    style={{ height: contentHeight, padding, gap }}
                >
                    {children}
                </div>

                <div className="absolute inset-0 flex pointer-events-none">
                    {/* SIDE */}
                    <svg className="block h-full w-auto shrink-0 aspect-[17/75]" width="17" height="75" viewBox="0 0 17 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_46_61)">
                            <path d="M201.677 49.9736C201.677 49.7748 201.756 49.584 201.896 49.4434L213.94 37.3994L201.896 25.3564C201.756 25.2158 201.677 25.0251 201.677 24.8262V17.165H123.915C123.716 17.165 123.524 17.086 123.384 16.9453L107.5 1.06055L91.6162 16.9453C91.4756 17.086 91.2839 17.165 91.085 17.165H13.3232V24.8262C13.3232 25.0251 13.2442 25.2158 13.1035 25.3564L1.06055 37.3994L13.1035 49.4434C13.2441 49.584 13.3232 49.7748 13.3232 49.9736V57.6348H91.085C91.2839 57.6348 91.4756 57.7138 91.6162 57.8545L107.5 73.7383L123.384 57.8545C123.524 57.7138 123.716 57.6348 123.915 57.6348H201.677V49.9736Z" vectorEffect="non-scaling-stroke" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_46_61">
                                <rect width="17" height="75" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    {/* LINE */}
                    <svg
                        className="block h-full min-w-0 flex-1 overflow-visible"
                        viewBox="0 0 17 75"
                        preserveAspectRatio="none"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M0 17.165H17 M0 57.635H17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    {/* MID */}
                    {midSection &&
                        < svg className="block h-full w-auto shrink-0 aspect-[39/75]" width="39" height="75" viewBox="0 0 39 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_46_66)">
                                <path d="M113.677 49.9736C113.677 49.7748 113.756 49.584 113.896 49.4434L125.94 37.3994L113.896 25.3564C113.756 25.2158 113.677 25.0251 113.677 24.8262V17.165H35.915C35.7161 17.165 35.5244 17.086 35.3838 16.9453L19.5 1.06055L3.61621 16.9453C3.47556 17.086 3.28387 17.165 3.08496 17.165H-74.6768V24.8262C-74.6768 25.0251 -74.7558 25.2158 -74.8965 25.3564L-86.9395 37.3994L-74.8965 49.4434C-74.7559 49.584 -74.6768 49.7748 -74.6768 49.9736V57.6348H3.08496C3.28387 57.6348 3.47556 57.7138 3.61621 57.8545L19.5 73.7383L35.3838 57.8545C35.5244 57.7138 35.7161 57.6348 35.915 57.6348H113.677V49.9736Z" vectorEffect="non-scaling-stroke" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_46_66">
                                    <rect width="39" height="75" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    }


                    {/* LINE */}
                    {midSection &&
                        <svg
                            className="block h-full min-w-0 flex-1 overflow-visible"
                            viewBox="0 0 17 75"
                            preserveAspectRatio="none"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M0 17.165H17 M0 57.635H17"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    }

                    {/* SIDE */}
                    <svg className="block h-full w-auto shrink-0 aspect-[17/75] rotate-180" width="17" height="75" viewBox="0 0 17 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_46_61)">
                            <path d="M201.677 49.9736C201.677 49.7748 201.756 49.584 201.896 49.4434L213.94 37.3994L201.896 25.3564C201.756 25.2158 201.677 25.0251 201.677 24.8262V17.165H123.915C123.716 17.165 123.524 17.086 123.384 16.9453L107.5 1.06055L91.6162 16.9453C91.4756 17.086 91.2839 17.165 91.085 17.165H13.3232V24.8262C13.3232 25.0251 13.2442 25.2158 13.1035 25.3564L1.06055 37.3994L13.1035 49.4434C13.2441 49.584 13.3232 49.7748 13.3232 49.9736V57.6348H91.085C91.2839 57.6348 91.4756 57.7138 91.6162 57.8545L107.5 73.7383L123.384 57.8545C123.524 57.7138 123.716 57.6348 123.915 57.6348H201.677V49.9736Z" vectorEffect="non-scaling-stroke" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_46_61">
                                <rect width="17" height="75" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="text-sm text-beige-600 uppercase flex gap-1">
                {keys.map((key, index) => (
                    <React.Fragment key={key}>
                        <p className="tracking-widest px-1 border inline">
                            {key}
                        </p>
                        {index < keys.length - 1 && (
                            <p className="scale-140"> / </p>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>

    );
}

export default ButtonWrapper;
