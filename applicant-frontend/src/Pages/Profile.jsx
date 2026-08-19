import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [editing, setEditing] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/applicant/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("applicant");
                    navigate("/login");
                    return;
                }

                throw new Error(
                    data.message ||
                    "Failed to load profile"
                );
            }

            setProfile(data.applicant);

            setName(data.applicant.name || "");
            setPhone(data.applicant.phone || "");

        } catch (error) {

            console.error(error);

            setError("Unable to load profile");

        } finally {

            setLoading(false);
        }
    };


    const handleSave = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setSaving(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/applicant/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name,
                        phone
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to update profile"
                );

                return;
            }

            setMessage(data.message);

            setEditing(false);

            // Update local applicant data
            const storedApplicant =
                JSON.parse(
                    localStorage.getItem("applicant")
                ) || {};

            localStorage.setItem(
                "applicant",
                JSON.stringify({
                    ...storedApplicant,
                    name
                })
            );

            // Refresh profile
            fetchProfile();

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to server"
            );

        } finally {

            setSaving(false);
        }
    };


    if (loading) {

        return (
            <div className="simple-page">
                <h1>Loading profile...</h1>
            </div>
        );
    }


    return (
        <div className="simple-page">

            <div className="page-header">

                <div>
                    <h1>My Profile</h1>

                    <p>
                        Manage your applicant information.
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="back-btn"
                >
                    ← Dashboard
                </Link>

            </div>


            <div className="profile-card">

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <div className="profile-header">

                    <div className="profile-avatar">

                        {profile?.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>

                    <div>

                        <h2>
                            {profile?.name}
                        </h2>

                        <p>
                            Applicant
                        </p>

                    </div>

                </div>


                {!editing ? (

                    <div className="profile-details">

                        <div className="profile-field">

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {profile?.name}
                            </strong>

                        </div>


                        <div className="profile-field">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {profile?.email}
                            </strong>

                        </div>


                        <div className="profile-field">

                            <span>
                                Phone Number
                            </span>

                            <strong>
                                {profile?.phone ||
                                    "Not provided"}
                            </strong>

                        </div>


                        <button
                            className="apply-large-btn"
                            onClick={() => {
                                setMessage("");
                                setError("");
                                setEditing(true);
                            }}
                        >
                            Edit Profile
                        </button>

                    </div>

                ) : (

                    <form
                        className="profile-form"
                        onSubmit={handleSave}
                    >

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />


                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                        />

                        <small>
                            Email cannot be changed.
                        </small>


                        <label>
                            Phone Number
                        </label>

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            placeholder="Enter phone number"
                        />


                        <div className="profile-actions">

                            <button
                                type="submit"
                                className="apply-large-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>


                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setEditing(false);
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
}

export default Profile;