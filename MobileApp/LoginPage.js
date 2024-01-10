import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Select } from './components/ui';
import { handleLogin, handleSignup } from './services/handleLogin';
import { AuthContext } from './AuthContext';
import LoadingModal from './components/LoadingModal';
import logo from './assets/cancerlogo.png'; // Import the logo image
import { Alert } from 'react-native';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(''); // Add role state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { setUser } = useContext(AuthContext);

    const performLogin = async () => {
        setLoading(true);
        setError('');
        console.log('Attempting to log in...'); // Debug log
        try {
            const userData = await handleLogin(username, password);
            console.log('Login response:', userData); // Debug log
            setUser({ token: userData.token, userType: userData.role, username: userData.username });
            console.log('Login Successful'); // Success indication
        } catch (err) {
            console.error('Login error:', err); // Debug log
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setPassword('');
        setEmail('');
        setRole('');
    };

    const performSignup = async () => {
        setLoading(true);
        setError('');
        console.log('Attempting to sign up...'); // Debug log

        try {
            const userData = await handleSignup(username, password, email, role);

            console.log('Signup Successful'); // Success indication
            Alert.alert('Success', 'You have been registered. Please login.'); // Display success message
        } catch (err) {
            console.error('Signup error:', err); // Debug log
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <View style={styles.logoContainer}>
                                <Image source={logo} style={styles.logo} resizeMode="contain" />
                            </View>
                            <View style={[styles.inputContainer, { marginBottom: 10 }]}>
                                <Input
                                    placeholder="Username"
                                    value={username}
                                    label="Enter your Username"
                                    onChangeText={setUsername}
                                    autoFocus={true}
                                />
                            </View>
                            {!isLogin && (
                                <>
                                    <View style={[styles.inputContainer, { marginBottom: 10 }]}>
                                        <Input
                                            placeholder="Email"
                                            value={email}
                                            label="Enter your email"
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                    <View style={[styles.inputContainer, { marginBottom: 10 }]}>
                                        <Select
                                            buttonTitle="Select Role"
                                            items={['user', 'admin']}
                                            selectedValue={role}
                                            onSelect={(value) => setRole(value)}
                                        />
                                    </View>
                                </>
                            )}
                            <View style={[styles.inputContainer, { marginBottom: 10 }]}>
                                <Input
                                    placeholder="Password"
                                    value={password}
                                    label="Enter your Password"
                                    onChangeText={setPassword}
                                    isPassword={true}
                                />
                            </View>
                            {loading && <Text>Loading...</Text>}

                            {error && <Text style={styles.errorText}>{error}</Text>}
                            <View style={styles.buttonContainer}>
                                <Button
                                    title={isLogin ? "Login" : "Signup"}
                                    onPress={isLogin ? performLogin : performSignup}
                                />
                            </View>
                            <TouchableOpacity onPress={toggleForm} style={styles.toggleButton}>
                                <Text>{isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}</Text>
                            </TouchableOpacity>
                        </View>
                        <LoadingModal visible={loading} />
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 20, // Updated marginTop
        minHeight: 400, // Updated minHeight
    },
    logoContainer: {
        alignItems: 'center', // Center-align the logo
        marginBottom: 10, // Updated marginBottom
        marginTop: 10, // Updated marginTop
    },
    logo: {
        width: 200, // Set the width of the logo
        height: 100, // Set the height of the logo
    },
    inputContainer: {
        marginBottom: 10, // Updated marginBottom
    },
    // Rest of the styles...
});
