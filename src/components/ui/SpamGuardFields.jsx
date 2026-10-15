import { useEffect, useState } from 'react';

// Hidden anti-spam fields for public forms (see server/security.js -> spamGuard):
// - formToken: server-signed timestamp; proves the form was loaded by a browser and not
//   submitted instantly by a bot
// - website: honeypot. Hidden from people, but bots that fill every field fill it.
export const SpamGuardFields = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        fetch('/api/form-token')
            .then(res => res.json())
            .then(data => setToken(data.token))
            .catch(() => { /* server will ask the visitor to refresh */ });
    }, []);

    return (
        <>
            <input type="hidden" name="formToken" value={token} />
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>
                    Leave this empty
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                </label>
            </div>
        </>
    );
};
