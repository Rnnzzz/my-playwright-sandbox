import { test, expect } from '@playwright/test';
import { BookingPayload, CreateBookingResponse } from '../../src/utils/booking.model';

test.describe('Booking Service Testing', () => {
    let authToken: string;
    let dynamicBookingId: number;
    const BASE_URL = 'https://restful-booker.herokuapp.com'

    const validPayload: BookingPayload = {
        firstname: 'Renz',
        lastname: 'Meer',
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
            checkin: '2026-06-01',
            checkout: '2026-06-15',
        },
        additionalneeds: 'Late Checkout',
    };

    test.beforeAll(async ({ request }) => {
        const authResponse = await request.post(BASE_URL + '/auth', {
            data: {
                username: 'admin',
                password: 'password123',
            },
        });

        expect(authResponse.ok()).toBeTruthy();
        const authData = await authResponse.json();
        authToken = authData.token;
    });

    test.describe('@POST CreateBooking Endpoint', () => {

        test('@Positive - Should successfully create a booking', async ({ request }) => {
            const response = await request.post(BASE_URL + '/booking', { data: validPayload });

            expect(response.status()).toBe(200);
            expect(response.headers()['content-type']).toContain('application/json');

            const body: CreateBookingResponse = await response.json();

            expect(body).toHaveProperty('bookingid');
            expect(typeof body.bookingid).toBe('number');
            expect(body.booking.firstname).toBe(validPayload.firstname);
            expect(body.booking.lastname).toBe(validPayload.lastname);
            expect(body.booking.totalprice).toBe(validPayload.totalprice);
            expect(body.booking.depositpaid).toBe(validPayload.depositpaid);
            expect(body.booking.bookingdates.checkin).toBe(validPayload.bookingdates.checkin);
            expect(body.booking.bookingdates.checkout).toBe(validPayload.bookingdates.checkout);
            expect(body.booking.additionalneeds).toBe(validPayload.additionalneeds);

            dynamicBookingId = body.bookingid;
            console.log(dynamicBookingId);
        });

        test('@Negative - Should fail when executing request with missing required field', async ({ request }) => {
            const brokenPayload = {
                lastname: 'FlawedData',
                totalprice: 0
            };

            const response = await request.post(BASE_URL + '/booking', { data: brokenPayload });
            expect(response.status()).toBe(500);
        });
    });

    test.describe('@GET GetBooking Endpoints', () => {

        test('@Positive - Should retrieve exact data for an existing record', async ({ request }) => {
            const response = await request.get(BASE_URL + `/booking/3`);

            expect(response.status()).toBe(200);

            const body: BookingPayload = await response.json();
            const expectedData = {checkin: "2024-12-17", checkout: "2025-11-20" };

            expect(body.firstname).toBe("Mark");
            expect(body.bookingdates).toEqual(expectedData);
        });

        test('@Negative - Should return a 404 resource exception for nonexistent record', async ({ request }) => {
            const deadFirstName = "Nonexistent";
            const deadLastName = "Nonexistent";
            const response = await request.get(`/booking/empty/firstname=${deadFirstName}&lastname=${deadLastName}`);

            expect(response.status()).toBe(404);
        });
    });

    test.describe('@PUT UpdateBooking Endpoints', () => {

        test('@Positive - Should modify data records succesfully', async ({ request }) => {
            const updatedPayload: BookingPayload = {
                ...validPayload,
                firstname: 'Janet',
                totalprice: 320,
                additionalneeds: 'All-inclusive Upgrade'
            };

            const response = await request.put(BASE_URL + `/booking/6`, {
                headers: { 'Cookie': `token=${authToken}` },
                data: updatedPayload,
            });

            expect(response.status()).toBe(200);

            const body: BookingPayload = await response.json();

            expect(body.firstname).toBe('Janet');
            expect(body.totalprice).toBe(320);
            expect(body.additionalneeds).toBe('All-inclusive Upgrade');
        });

        test('@Negative - Should reject the update request and return 403 Forbidden if the provided token is invalid', async ({ request }) => {
            const response = await request.put(BASE_URL + `/booking/${dynamicBookingId}`, {
                data: validPayload, 
            });

            expect(response.status()).toBe(403);
            expect(await response.text()).toBe('Forbidden');
        });
    });

    test.describe('@DELETE DeleteBooking Endpoints', () => {

        test('@Negative - Should reject the delete request and return 403 Forbidden if the provided token is invalid', async ({ request }) => {
            const response = await request.delete(BASE_URL + `/booking/${dynamicBookingId}`, {
                headers: { 'Cookie': 'token=BAD_TOKEN_123' },
            });

            expect(response.status()).toBe(403);
        });

        test('@Positive - Should succesfully delete existing record', async ({ request }) => {
            const deleteResponse = await request.delete(BASE_URL + `/booking/${dynamicBookingId}`, {
                headers: { 'Cookie': `token=${authToken}` },
            });

            expect(deleteResponse.status()).toBe(201);

            const reFetchCheck = await request.get(BASE_URL + `/booking/${dynamicBookingId}`);
            expect(reFetchCheck.status()).toBe(405);
        });
    });
});
