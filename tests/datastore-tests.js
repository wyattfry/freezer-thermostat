const datastore = require('../data/datastore');
const path = require('path');
const fs = require('fs').promises;
const assert = require('assert');

async function append_should_write_data() {
    // Arrange
    const randomFileName = getRandomFileName();
    const randomContent = randomString();
    const expectedLength = 1;

    // Act
    await datastore.append(randomContent, randomFileName);
    const content = await datastore.readLastLines(null, randomFileName);

    // Assert
    assert.deepStrictEqual(content, [randomContent]);

    try {
        await fs.unlink(randomFileName);
    } catch (error) {
        console.log('Could not delete file', randomFileName);
    }

    console.log('append_should_write_data ... passed');
}

async function append_should_not_overwrite_data() {
    // Arrange
    const randomFileName = getRandomFileName();
    const randomContent1 = randomString();
    const randomContent2 = randomString();

    // Act
    await datastore.append(randomContent1, randomFileName);
    await datastore.append(randomContent2, randomFileName);
    const content = await datastore.readLastLines(null, randomFileName);

    // Assert
    assert.deepStrictEqual(content, [randomContent2, randomContent1]);

    try {
        await fs.unlink(randomFileName);
    } catch (error) {
        console.log('Could not delete file', randomFileName);
    }

    console.log('append_should_not_overwrite_data ... passed');
}

async function readLastLines_should_return_requested_number_of_lines() {
    // Arrange
    const randomFileName = getRandomFileName();
    const expectedLineCount = 3;
    const randomContentLines = []

    for (let i = 0; i < 10; i++) {
        let randomContent = '' + i + '\t' + randomString();
        await datastore.append(randomContent, randomFileName);
        randomContentLines.push(randomContent);
    }

    // Act
    const content = await datastore.readLastLines(expectedLineCount, randomFileName);

    // Assert
    assert.strictEqual(content.length, expectedLineCount)

    try {
        await fs.unlink(randomFileName);
    } catch (error) {
        console.log('Could not delete file', randomFileName);
    }

    console.log('readLastLines_should_return_requested_number_of_lines ... passed');
}

async function readLastLines_should_cleanup_store_if_too_large() {
    // Arrange
    const randomFileName = getRandomFileName();
    const randomContentLines = []
    const maxLines = 60 * 24 * 7;
    const deleteBatchLineCount = 60 * 24;
    const expectedLineCount = maxLines + 1 - deleteBatchLineCount;

    for (let i = 0; i < maxLines + 1; i++) {
        let randomContent = '' + i + '\t' + randomString();
        await datastore.append(randomContent, randomFileName);
        randomContentLines.push(randomContent);
    }

    // Act
    let content;
    try {
        content = await datastore.readLastLines(expectedLineCount, randomFileName);
    } catch (error) {
        console.log(error);
    }

    // Assert
    assert.strictEqual(content.length, expectedLineCount)

    try {
        await fs.unlink(randomFileName);
    } catch (error) {
        console.log('Could not delete file', randomFileName);
    }

    console.log('readLastLines_should_cleanup_store_if_too_large ... passed');
}

// Helpers

function randomString(length = 20) {
    return require('crypto')
        .randomBytes(length)
        .toString('hex');
}

function getRandomFileName() {
    return path.join(__dirname, 'test-' + randomString() + '.txt');
}

append_should_write_data()
    .then(append_should_not_overwrite_data)
    .then(readLastLines_should_return_requested_number_of_lines)
    .then(readLastLines_should_cleanup_store_if_too_large)
    .catch(console.error);