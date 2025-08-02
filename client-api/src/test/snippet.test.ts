import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index';
import Snippet from '../models/snippet';
import connectDB from '../startup/database';
import config from 'config';
import { Server } from 'http';
import { SnippetPOSTBody } from '../types/createSnippet';

describe('/api/snippet', () => {
    let server: Server;

    beforeAll(() => {
        connectDB();
    });

    beforeEach(() => {
        server = app.listen(config.get('server.port'), () => {
            console.info('server is running');
        });
    });

    afterEach(async () => {
        await server.close();
        await Snippet.deleteMany({});
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    describe('POST /api/snippet/create', () => {
        it('Create a snippet successfully and save in DB', async () => {
            const payload: SnippetPOSTBody = {
                code: "function code() { console.log('Hello world!')}",
                description: "A simple hello world function in Javascript",
                tags: ['Hello-world', 'util'],
                language: 'Javascript'
            };

            const res = await request(server)
                .post('/api/snippet/create')
                .send(payload)

            expect(res.status).toBe(201);
            expect(res.body).toEqual(
                expect.objectContaining({
                    _id: expect.any(String), // _id should be a string
                    code: payload.code,
                    description: payload.description,
                    tags: payload.tags,
                    embedding: expect.any(Array), // If embedding is expected
                })
            );
        });
    });
});