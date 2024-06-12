const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const axios = require('axios');

router.get('/some-protected-route', auth, (req, res) => {
    res.json({ msg: 'This is a protected route' });
});

const { check, validationResult } = require('express-validator');

router.post('/login1', async (req, res) => {
    const { username, password, type } = req.body;

    
    try {
        console.log('Login successful:', req.body);
      // Assuming the login URL expects a POST request with a JSON body
      const response = await axios.post('https://hotsel-ms.vercel.app/auth/login', {
        username,
        password,
        type
      });
  
      // Check if login is successful and forward data to frontend
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        
        // Forwarding response data to a front-end URL (assuming it also expects a POST request)
        const frontendResponse = await axios.post('https://hotsel-ms.vercel.app/auth/login', response.data);
  
        // Send response to the client
        res.json({
          message: 'Login and data forwarding successful',
          data: frontendResponse.data
        });
      } else {
        // Handle non-200 response
        res.status(response.status).json({ message: 'Login failed' });
      }
    } catch (error) {
      console.error('Error during login or data forwarding:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// POST /register
router.post('/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, name, contactNumber, cnic, dateOfBirth, role } = req.body;

        try {
            // See if user exists
            console.log(email);
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            user = new User({
                username,
                email,
                password,
                name,
                contactNumber,
                cnic,
                dateOfBirth,
                role
            });

            console.log(user);

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // Save user to the database
            await user.save();

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id // user._id in MongoDB
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 3600 }, // Token expires in 1 hour
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

            console.log(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


// // Register a new user
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password, email, name, contactNumber, cnic, dateOfBirth, role } = req.body;
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ msg: 'User already exists' });
//         }

//         user = new User({ username, password, email, name, contactNumber, cnic, dateOfBirth, role });
//         user.password = await bcrypt.hash(password, 10);
//         await user.save();

//         const payload = {
//             user: {
//                 id: user.id
//             }
//         };

//         jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//         });
//     } catch (err) {
//         res.status(500).send('Server error');
//     }
// });

// Authenticate user and get token (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid user' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch, password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, username: user.username, userid: user.id, usertype: user.role});
            console.log(token);
            console.log(user.username);
            console.log(user.id);
            console.log(user.role);
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update user details
router.put('/:id', auth, async (req, res) => {
    try {
        const userUpdates = req.body;
        if (userUpdates.password) {
            userUpdates.password = await bcrypt.hash(userUpdates.password, 10);
        }
        const user = await User.findByIdAndUpdate(req.params.id, { $set: userUpdates }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete a user
router.delete('/:id', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});  // Fetches all users
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
