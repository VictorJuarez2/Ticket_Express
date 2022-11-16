import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

cred = credentials.Certificate("/Users/jvega/projects/Ticket_Express/ticket-master-c2e65-firebase-adminsdk-ignyq-90563d0c41.json") #Python Live\\team-3-firebase-admin.json
firebase_admin.initialize_app(cred, {
    # Change this to your project ID
    'projectId':"ticket-master-c2e65",
})

user = auth.get_user_by_email('joe@gmail.com')
if user:
    auth.set_custom_user_claims(user.uid,{
        'role' : 'admin'
    })
