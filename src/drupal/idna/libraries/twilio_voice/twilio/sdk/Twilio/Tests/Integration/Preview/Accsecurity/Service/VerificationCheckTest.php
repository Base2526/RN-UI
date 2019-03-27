<?php

/**
 * This code was generated by
 * \ / _    _  _|   _  _
 * | (_)\/(_)(_|\/| |(/_  v1.0.0
 * /       /
 */

namespace Twilio\Tests\Integration\Preview\Accsecurity\Service;

use Twilio\Exceptions\DeserializeException;
use Twilio\Exceptions\TwilioException;
use Twilio\Http\Response;
use Twilio\Tests\HolodeckTestCase;
use Twilio\Tests\Request;

class VerificationCheckTest extends HolodeckTestCase {
    public function testCreateRequest() {
        $this->holodeck->mock(new Response(500, ''));

        try {
            $this->twilio->preview->accSecurity->services("VAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                                               ->verificationChecks->create("code");
        } catch (DeserializeException $e) {}
          catch (TwilioException $e) {}

        $values = array('Code' => "code", );

        $this->assertRequest(new Request(
            'post',
            'https://preview.twilio.com/Verification/Services/VAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/VerificationCheck',
            null,
            $values
        ));
    }

    public function testVerificationChecksResponse() {
        $this->holodeck->mock(new Response(
            201,
            '
            {
                "sid": "VEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "service_sid": "VAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "to": "+14159373912",
                "channel": "sms",
                "status": "approved",
                "valid": false,
                "date_created": "2015-07-30T20:00:00Z",
                "date_updated": "2015-07-30T20:00:00Z"
            }
            '
        ));

        $actual = $this->twilio->preview->accSecurity->services("VAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                                                     ->verificationChecks->create("code");

        $this->assertNotNull($actual);
    }
}