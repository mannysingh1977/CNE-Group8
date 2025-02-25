const loginTable: React.FC = () => {
    return (
        <>
            <table className="mb-3" style={{ borderCollapse: 'separate', borderSpacing: '10px', border: '1px solid black'}}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody className="mb-3">
                    <tr>
                        <td>Jhon.owner@userbazaar.com</td>
                        <td>JhonsSuperSecretPassword</td>
                        <td>Owner</td>
                    </tr>
                    <tr>
                        <td>Emily.admin@userbazaar.com</td>
                        <td>SuperSecretPassword</td>
                        <td>Amin</td>
                    </tr>
                    <tr>
                        <td>Chris.Brown@gmail.com</td>
                        <td>AnotherSecurePassword</td>
                        <td>User</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default loginTable;