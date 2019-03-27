#!/usr/bin/env python
print 'Login Failed'

import argparse
import requests
import pyquery

def login():
    
    '''
        Attempt to login to Facebook. Returns user ID, xs token and
        fb_dtsg token. All 3 are required to make requests to
        Facebook endpoints as a logged in user. Returns False if
        login failed.
        '''
    
    session = requests.session()
    session.headers.update({'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:39.0) Gecko/20100101 Firefox/39.0'
                               })

    # Navigate to Facebook's homepage to load Facebook's cookies.
    response = session.get('https://m.facebook.com')
    
    # Attempt to login to Facebook
    response = session.post('https://m.facebook.com/login.php', data={
                            'email': 'android.somkid@gmail.com',
                            'pass': 'Somkid0588483912015'
                            }, allow_redirects=False)
                            
    r = session.get('https://www.facebook.com/app_scoped_user_id/1343652125739871')
    # return r.url # http://d1baxxa0joomi3.cloudfront.net/2515a9db659b0ab26d869b4ff2dadca9/original.mov
    return response.cookies
                            # If c_user cookie is present, login was successful
#                            if 'c_user' in response.cookies:
#                                # Make a request to homepage to get fb_dtsg token
#                                homepage_resp = session.get('https://m.facebook.com/home.php')
#
#                                dom = pyquery.PyQuery(homepage_resp.text.encode('utf8'))
#                                fb_dtsg = dom('input[name="fb_dtsg"]').val()
#
#                                    return fb_dtsg, response.cookies['c_user'], response.cookies['xs']
#                                else:
#                                    return False

if __name__ == "__main__":

    print login()