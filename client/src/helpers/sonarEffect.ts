import theme from "../theme";

const brandColor = theme.global?.colors?.brand;

export const sonarEffectContent = (diameter: number) => `
    content: "";
    height: ${diameter}vw;
    width: ${diameter}vw;
    left: calc(50% - ${diameter / 2}vw);
    top: calc(50% - ${diameter / 2}vw);
    border-radius: 50%;
    position: absolute;
    opacity: 20%;
    animation: sonar-effect 1.5s ease-in-out 0.1s infinite;
`;

export const sonarEffectAnimation = () => `
    @keyframes sonar-effect {
        0% {
        opacity: 0.05;
        }
        40% {
        opacity: 0.15;
        box-shadow: 0 0 20px 10px ${brandColor};
        }
        100% {
        box-shadow: 0 0 40px 20px ${brandColor};
        transform: scale(2);
        opacity: 0;
        }
    }
`;
