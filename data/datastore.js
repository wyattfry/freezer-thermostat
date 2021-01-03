const fs = require('fs').promises;
const path = require('path');

const config = {
    // worker records every one minute
    // keep 1 week of readings
    maxLineCount: 60 * 24 * 7,
    // delete in 1 day batches when max count exceeded
    deleteBatchLineCount: 60 * 24,
    datastoreFileName: path.join(__dirname, 'data.txt'),
}

exports.append = async function (data, file = config.datastoreFileName) {
    // if line count is greater than max allowed, delete some lines from top
    let handle;
    try {
        // 'a+' - Open file for reading and appending. The file is created if it does not exist.
        handle = await fs.open(file, 'a+');;
        await handle.appendFile(data + '\n');
    } catch (error) {
        console.log('Failed to append data.', error);
    } finally {
        if (!!handle) {
            await handle.close();
        }
    }
}

exports.readLastLines = async function (count, file = config.datastoreFileName) {
    let handle;
    let content;
    try {
        handle = await fs.open(file, 'r');;
        content = await handle.readFile({ encoding: 'utf8' });
    } catch (error) {
        console.log('Failed to read data.', error);
    } finally {
        if (!!handle) {
            await handle.close();
        }
    }
    const lines = content.split('\n');
    const endIdx = lines.length - 1; // last element is empty string
    let startIdx;
    if (!count || count > lines.length) {
        startIdx = 0;
    } else {
        startIdx = endIdx - count;
    }

    const sliced = lines.slice(startIdx, endIdx);

    return sliced;
}