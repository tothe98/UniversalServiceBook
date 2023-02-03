import React, {useEffect, useState} from "react";
import {
    axios,
    toast,
    Link,
    Button,
    Grid,
    styled,
    TextField,
    Typography,
    Input
} from "../lib/GlobalImports"
import {
    MyCircularSkeleton,
    MyFullWidthInputSkeleton,
    MyInputSkeleton
} from "../lib/Skeletons";
import {
    SubTitle,
    MyGridItem,
    FormCancelButton,
    FormActionButton,
    AvatarImage
} from "../lib/StyledComponents";
import {
    axiosInstance
} from "../lib/GlobalConfigs"
import useAuth from "../hooks/useAuth";

function Settings({handleChangeTab}) {
    /* getting context data */
    const { auth, setAuth } = useAuth();

    /* loading screen variables */
    const [isLoading, setIsLoading] = useState(true);
    const [isSent, setIsSent] = useState(false);

    const [picture, setPicture] = useState("");
    const [pictureInBase64, setPictureInBase64] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [home, setHome] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");
    const [changePasswordError, setChangePasswordError] = useState(null);
    const [oldPasswordError, setOldPasswordError] = useState(null);
    const [formUnderProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        setPicture(auth.user.picture);
        setFirstName(auth.user.fName);
        setLastName(auth.user.lName);    
        setEmail(auth.user.email);
        setHome(auth.user.home);
        setPhoneNumber(auth.user.phone);
        setIsLoading(false);

        setTimeout(() => {
            console.log(picture)
        }, 1000)
    }, []);

    const handleProfileImageChange = async (e) => {
        setIsProcessing(true)
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setPictureInBase64(base64);
        setPicture(file);
        setIsProcessing(false)
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    const getUserDatas = async (token) => {
        const response = await axiosInstance.get("getUserData", {
            headers: {
                "x-access-token": token
            }
        });
        let user = response.data.data.user;
        let highestRole = 2001;
        Array.from(user.roles).forEach(role => {
            if (role > highestRole) {
                highestRole = role;
            } 
        })
        const role = highestRole;

        setPicture(user.picture);
        setFirstName(user.fName);
        setLastName(user.lName);
        setEmail(user.email);
        setHome(user.home);
        setPhoneNumber(user.phone);

        setAuth({ user, token, role });
    }

    const handleUpdateUser = async (e) => {
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
        }, Number(process.env.REACT_APP_BUTTON_CLICK_TIMEOUT));
        e.preventDefault()
        if (formUnderProcessing) return;

        const formData = new FormData();

        setOldPasswordError(null)
        setChangePasswordError(null)
        let changedSomething = false;

        // password changing
        if (password){
            if (newPassword !== reNewPassword) {
                setChangePasswordError("A két jelszó nem stimmel!");
                toast.error(changePasswordError)
                return;
            }

            if (newPassword.length >= 8 && reNewPassword.length >= 8) {
                toast.error("A jelszónak legalább 8 karakternek kell lennie!")
                return;
            }

            formData.append("oldPassword", password);
            formData.append("newPassword", newPassword);
            changedSomething = true;
        } else {
            if (newPassword || reNewPassword) {
                toast.error("Opss! Kérlek töltsd ki az összes jelszó mezőt!")
            }
        }

        if (auth.user.fName !== firstName) {
            changedSomething = true;
            formData.append("fName", firstName);
        }
        if (auth.user.lName !== lastName) {
            changedSomething = true;
            formData.append("lName", lastName);
        }
        if (auth.user.home !== home) {
            changedSomething = true;
            formData.append("home", home);
        }
        if (auth.user.phone !== phoneNumber) {
            changedSomething = true;
            formData.append("phone", phoneNumber);
        }

        // profile picture
        // if user does not have picture attribute the user does not have picture otherwise I have to compare the two base64 string
        if (auth.user.picture === undefined) {
            if (picture)
            {
                changedSomething = true;
                formData.append("picture", picture);
            }
        } else if(pictureInBase64 !== auth.user.picture) {
            formData.append("picture", picture);
            changedSomething = true;
        }

        if (changedSomething) {
            const headers = {
                'Content-Type': 'multipart/form-data',
                'x-access-token': localStorage.getItem("token")
            }
            const response = await axiosInstance.put("updateUser", formData, { headers });
            await getUserDatas(localStorage.getItem("token"));

            toast.success("Sikeresen frissítetted a fiókodat!")
        }
    }

    if (isLoading) {
        return (<React.Fragment>
            <form onSubmit={handleUpdateUser}>
                <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
                    <MyGridItem item>
                        <Grid container direction="row" spacing={1.5}>
                            <Grid item id="WallpaperItem">
                                <MyCircularSkeleton variant="circular" />
                            </Grid>

                            <Grid item>
                                <SubTitle variant='h3'>Profilkép beállítások</SubTitle>

                                <Grid container direction="column" sx={{marginTop: "auto"}}>
                                    <MyFullWidthInputSkeleton />
                                </Grid>
                            </Grid>
                        </Grid>
                    </MyGridItem>

                    <MyGridItem item>
                        <SubTitle variant='h3'>Felhasználói adatok</SubTitle>

                        <Grid container direction="column" spacing={1.5}>
                            <Grid item><MyFullWidthInputSkeleton /></Grid>
                            <Grid item><MyFullWidthInputSkeleton /></Grid>
                            <Grid item><MyFullWidthInputSkeleton /></Grid>
                        </Grid>
                    </MyGridItem>

                    <MyGridItem item>
                        <SubTitle variant='h3'>Jelszó beállítások</SubTitle>

                        <Grid container direction="column" spacing={1.5}>
                            <Grid item><MyFullWidthInputSkeleton /></Grid>
                            <Grid item><MyFullWidthInputSkeleton /></Grid>
                            <Grid item><MyFullWidthInputSkeleton /></Grid>
                        </Grid>
                    </MyGridItem>

                    <MyGridItem item>
                        <Grid container direction="row" spacing={1.5} justifyContent="flex-end">
                            <MyInputSkeleton />
                            <MyInputSkeleton />
                        </Grid>
                    </MyGridItem>
                </Grid>
            </form>
        </React.Fragment>)
    }

    return (<React.Fragment>
        <form onSubmit={handleUpdateUser}>
            <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
                <MyGridItem item>
                    <Grid container direction="row" spacing={1.5}>
                        <Grid item id="WallpaperItem">
                            <AvatarImage src={
                                pictureInBase64
                                ?
                                pictureInBase64
                                :
                                picture 
                            } alt="profile image" id="wallpaperIMG" />
                        </Grid>

                        <Grid item>
                            <SubTitle variant='h3'>Profilkép beállítások</SubTitle>

                            <Grid container direction="column" sx={{marginTop: "auto"}}>
                                <TextField inputProps={{ accept: 'image/*' }} fullWidth name="wallpaper" placeholder="Kép kiválasztása..."
                                           type="file" onChange={e=>handleProfileImageChange(e)} />
                            </Grid>
                        </Grid>
                    </Grid>
                </MyGridItem>

                <MyGridItem item>
                    <SubTitle variant='h3'>Felhasználói adatok</SubTitle>

                    <Grid container direction="column" spacing={1.5}>
                        <Grid item><TextField
                            disabled
                            fullWidth
                            label="Felhasználói email"
                            defaultValue={email}
                        /></Grid>

                        <Grid item><TextField
                            fullWidth
                            label="Keresztnév:"
                            defaultValue={firstName}
                            onChange={e=>setFirstName(e.target.value)}
                        /></Grid>

                        <Grid item><TextField
                            fullWidth
                            label="Családnév:"
                            defaultValue={lastName}
                            onChange={e=>setLastName(e.target.value)}
                        /></Grid>

                        <Grid item><TextField
                            fullWidth
                            label="Telefonszám"
                            type="tel"
                            defaultValue={phoneNumber}
                            onChange={e=>setPhoneNumber(e.target.value)}
                        /></Grid>

                        <Grid item><TextField
                            fullWidth
                            label="Város"
                            defaultValue={ home ? home : ""}
                            onChange={e=>setHome(e.target.value)}
                        /></Grid>
                    </Grid>
                </MyGridItem>

                <MyGridItem item>
                    <SubTitle variant='h3'>Jelszó beállítások</SubTitle>

                    <Grid container direction="column" spacing={1.5}>
                        {
                            oldPasswordError
                                ?
                                <Grid item><TextField
                                    error
                                    label="Régi jelszó"
                                    defaultValue=""
                                    fullWidth
                                    type="password"
                                    onChange={e=>setPassword(e.target.value)}
                                /></Grid>
                                :
                                <Grid item><TextField
                                    label="Régi jelszó"
                                    defaultValue=""
                                    fullWidth
                                    type="password"
                                    onChange={e=>setPassword(e.target.value)}
                                /></Grid>
                        }

                        {
                            changePasswordError ? <React.Fragment>
                                    <Grid item><TextField
                                        error
                                        label="Új jelszó*"
                                        fullWidth
                                        type="password"
                                        onChange={e => setNewPassword(e.target.value)}
                                    /></Grid>

                                    <Grid item><TextField
                                        error
                                        label="Új jelszó**"
                                        fullWidth
                                        type="password"
                                        onChange={e => setReNewPassword(e.target.value)}
                                    /></Grid></React.Fragment>
                                :
                                <React.Fragment>
                                    <Grid item>
                                        <TextField
                                        label="Új jelszó*"
                                        fullWidth
                                        type="password"
                                        onChange={e => setNewPassword(e.target.value)}
                                        />
                                    </Grid>
                                <Grid item>
                                    <TextField
                                    label="Új jelszó**"
                                    fullWidth
                                    type="password"
                                    onChange={e=>setReNewPassword(e.target.value)}
                                    />
                                </Grid>
                                </React.Fragment>
                        }
                    </Grid>
                </MyGridItem>

                <MyGridItem item>
                    <Grid container direction="row" spacing={1.5} justifyContent="flex-end">
                        <Grid item>
                            {
                                isSent
                                ?
                                <FormActionButton disabled>Mentés</FormActionButton>
                                :
                                <FormActionButton type="submit">Mentés</FormActionButton>
                            }
                            </Grid>
                        <Grid item><FormCancelButton variant="contained" component={Link} to="/"  onClick={e=>{handleChangeTab(0)}} >Elvetés</FormCancelButton></Grid>
                    </Grid>
                </MyGridItem>
            </Grid>
        </form>
    </React.Fragment>)
}

export default Settings;