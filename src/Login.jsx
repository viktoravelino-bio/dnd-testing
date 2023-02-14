import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from './lib/firebase';

const provider = new GithubAuthProvider();
const Login = () => {
    function onGithubLoginClick() {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                // ...
            });
    }
    return (
        //create github login button
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <h1>Kanbam!</h1>
            <span style={{ fontSize: '5rem' }}>💥</span>
            <button
                onClick={onGithubLoginClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: '#333',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                }}
            >
                <ion-icon name='logo-github'></ion-icon>Login with Github
            </button>
        </div>
    );
};

export default Login;
