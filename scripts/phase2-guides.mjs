export const PHASE2_GUIDE_SLUGS = [
  'json-parse-unexpected-token-o',
  'json-parse-unexpected-token-u',
  'unexpected-token-nan-in-json',
  'unexpected-token-infinity-in-json',
  'unexpected-token-undefined-in-json',
  'unterminated-string-literal-in-json',
  'invalid-escape-character-in-json',
  'invalid-unicode-escape-in-json',
  'unexpected-token-bom-in-json',
  'empty-response-json-parse-error',
  'response-json-is-not-a-function',
  'body-stream-already-read-json',
  'unexpected-non-whitespace-character-after-json',
  'duplicate-keys-in-json',
  'extra-data-after-json',
  'unexpected-token-object-object-in-json',
  'truncated-json-response',
  'missing-comma-in-json-array',
  'leading-zero-in-json-number',
  'content-type-text-html-json-error',
]

export function createPhase2Guides(guide, section) {
  return [
    guide({
      slug: 'json-parse-unexpected-token-o',
      title: 'JSON.parse unexpected token o: Fix [object Object] Errors',
      description: 'Fix JSON.parse unexpected token o errors by checking whether an object was parsed again or converted to [object Object] before parsing.',
      summary: 'JSON.parse unexpected token o usually means the parser received [object Object] or a value that was already parsed.',
      primaryKeyword: 'JSON.parse unexpected token o',
      invalidCode: `[object Object]`,
      fixedCode: `{
  "status": "ok",
  "items": []
}`,
      sections: [
        section('What the error usually means', [
          'JSON.parse unexpected token o appears when `JSON.parse` receives text whose first unexpected character is `o`. The classic case is parsing `[object Object]`, which starts with a bracket and then the letter `o`. That string is not JSON; it is the default string representation of a JavaScript object.',
          'This guide is for developers debugging browser code, Node.js utilities, console snippets, or copied values from logs. The fastest question is simple: is the value raw JSON text, or has another layer already converted it into an object or a non-JSON string?',
        ]),
        section('Check whether the value is already parsed', [
          'If your framework, fetch wrapper, SDK, or middleware already parsed the response body, calling `JSON.parse` again is wrong. `JSON.parse` expects a string that contains JSON syntax. It does not accept a JavaScript object directly, and stringifying an object implicitly can produce `[object Object]` instead of real JSON.',
          'Inspect the type before parsing. In JavaScript, `typeof value` should be `string` before you pass it to `JSON.parse`. If it is `object`, use the object directly. If you need JSON text for display or transport, use `JSON.stringify(value)` instead of implicit concatenation.',
        ]),
        section('Fix the source of [object Object]', [
          'Look for string concatenation such as `"payload=" + objectValue` or template output that places an object into text without serializing it. That operation usually calls the object default string conversion and loses the JSON structure. Once the structure is lost, the parser cannot recover the original keys and values.',
          'The repair is to pass real JSON text into the parser or avoid parsing at that point entirely. Use `JSON.stringify(objectValue)` when you need to serialize an object, and use the existing object when parsing already happened earlier in the pipeline.',
        ]),
        section('Validate the raw text before parsing', [
          'When you are unsure what reaches `JSON.parse`, log a redacted raw sample or inspect it in the debugger before parsing. Do not log secrets, tokens, or customer data, but confirm the first characters and the value type. Paste the raw text into JSONFmt only if it is actually text that should be strict JSON.',
          'If JSONFmt rejects the same text, fix the producer. If JSONFmt validates the text but your code still fails, inspect the layers around parsing: double parsing, response helpers, local storage serialization, and string interpolation are common places where the value changes shape.',
        ]),
      ],
      faq: [
        ['What causes JSON.parse unexpected token o?', 'It is often caused by parsing `[object Object]` or parsing a JavaScript object that has already been converted away from JSON text.'],
        ['Should I call JSON.parse on an object?', 'No. `JSON.parse` expects a JSON string. If you already have an object, use it directly.'],
        ['How do I convert an object to JSON text?', 'Use `JSON.stringify(objectValue)`. Do not rely on implicit string concatenation.'],
        ['Can JSONFmt fix [object Object]?', 'JSONFmt can show that the text is not valid JSON, but the original object data must come from the source that produced it.'],
      ],
    }),
    guide({
      slug: 'json-parse-unexpected-token-u',
      title: 'JSON.parse unexpected token u: Fix Undefined and Empty Values',
      description: 'Fix JSON.parse unexpected token u errors by finding undefined values, empty storage entries, or responses that are not JSON strings.',
      summary: 'JSON.parse unexpected token u usually means `JSON.parse` received `undefined` or text that starts with the letter `u` instead of JSON.',
      primaryKeyword: 'JSON.parse unexpected token u',
      invalidCode: `undefined`,
      fixedCode: `{
  "enabled": true
}`,
      sections: [
        section('What unexpected token u means', [
          'JSON.parse unexpected token u usually means the parser saw the letter `u` where JSON syntax requires a value such as `{`, `[`, `"`, a number, `true`, `false`, or `null`. The most common source is passing `undefined` into `JSON.parse`, often from missing local storage, a failed lookup, or a function that did not return a value.',
          'This guide is for developers debugging JavaScript runtime errors rather than hand-edited JSON alone. The payload may never have been JSON text. The first step is to confirm what variable reaches the parser and why it is missing.',
        ]),
        section('Check localStorage and optional data', [
          'A common pattern is `JSON.parse(localStorage.getItem("settings"))`. If the key does not exist, `getItem` returns `null`, which is valid to parse as the JSON value `null`. But many wrappers return `undefined`, and parsing that value creates the token `u` error. Optional API fields can create the same issue.',
          'Guard the parse step. Check whether the value is a string before parsing, provide a default JSON string, or handle the missing case directly. A missing setting should become a controlled fallback, not a parser exception that hides the real absence of data.',
        ]),
        section('Avoid parsing values that are not JSON text', [
          'Do not pass `undefined`, plain objects, promises, response objects, or already parsed data into `JSON.parse`. Each of those values represents a programming mistake around data flow, not a JSON syntax problem. Parsing should happen at a boundary where raw text becomes a JavaScript value.',
          'If the value came from `fetch`, decide whether you need `response.json()` or `response.text()`. If a helper already called `response.json()`, do not parse the result again. If you read text, validate that the body is present and has the expected content type before parsing it manually.',
        ]),
        section('Make missing data explicit', [
          'A good fix makes the missing state visible. For example, if a local setting is optional, use a default object and save it back later. If an API body is empty, handle the empty status instead of pretending it is an object. JSON allows `null`, but an absent JavaScript variable and the JSON value `null` are different things.',
          'After you identify the raw string that should be JSON, paste it into JSONFmt to validate the syntax. If the raw string is literally `undefined`, fix the caller or data source rather than trying to rewrite that word into an object without knowing what data was intended.',
        ]),
      ],
      faq: [
        ['Why does JSON.parse say unexpected token u?', 'It usually received `undefined` or text beginning with `u`, neither of which is valid JSON syntax.'],
        ['Can JSON.parse handle undefined?', 'No. JSON has `null`, but it does not have an `undefined` value.'],
        ['How should I handle missing localStorage JSON?', 'Check for a stored string first and use a safe default when no value exists.'],
        ['Is this a JSON syntax error or code error?', 'It is often a code flow error because the parser was given the wrong value type.'],
      ],
    }),
    guide({
      slug: 'unexpected-token-nan-in-json',
      title: 'Unexpected Token NaN in JSON: Why NaN Is Invalid',
      description: 'Fix Unexpected token NaN in JSON errors by replacing JavaScript NaN values with valid JSON numbers or null before serialization.',
      summary: 'Unexpected token NaN in JSON means the payload contains the JavaScript value `NaN`, which strict JSON does not support.',
      primaryKeyword: 'Unexpected token NaN in JSON',
      invalidCode: `{
  "average": NaN,
  "count": 0
}`,
      fixedCode: `{
  "average": null,
  "count": 0
}`,
      sections: [
        section('Why NaN is not JSON', [
          'Unexpected token NaN in JSON happens because strict JSON supports finite numbers but does not support JavaScript special numeric values such as `NaN`. A JSON parser sees the letter `N` and rejects it because object values must be strings, numbers, booleans, null, arrays, or objects.',
          'This guide is for developers moving calculated data from JavaScript, Python, analytics code, or spreadsheets into an API payload. The value may make sense in the source language, but it must be converted before the data becomes strict JSON.',
        ]),
        section('Choose the right replacement', [
          'Do not blindly replace `NaN` with zero. Zero means a real numeric value, while `NaN` usually means missing, impossible, or undefined calculation. If the receiving system allows absence, use `null`. If it requires a number, decide the fallback from the domain rule rather than from JSON syntax.',
          'For averages, rates, and ratios, `null` is often safer than `0` when the denominator is zero or the value could not be calculated. For counters, a true zero may be correct. Make that distinction before sending the repaired payload downstream.',
        ]),
        section('Fix serialization at the source', [
          'If application code is generating `NaN` into a JSON-looking string, stop building JSON by concatenation. Use a serializer and normalize invalid numeric values before serialization. In JavaScript, `JSON.stringify` converts `NaN` values to `null` inside objects and arrays, which may or may not match your API contract.',
          'If your API rejects `null`, add validation before serialization so the user or caller sees a clear domain error. A parser error about `NaN` is late feedback; the calculation problem usually happened earlier.',
        ]),
        section('Validate numeric data after repair', [
          'After replacing `NaN`, validate the JSON syntax and then check the schema. Syntax validation only proves the payload can be parsed. It does not prove that `null`, zero, or another fallback is accepted by the API or reporting system.',
          'Paste a minimal redacted example into JSONFmt when debugging. Keep the calculation context in your code or tests so future changes do not reintroduce `NaN` values into serialized JSON.',
        ]),
      ],
      faq: [
        ['Is NaN valid JSON?', 'No. Strict JSON numbers must be finite numeric literals, and `NaN` is not allowed.'],
        ['Should I replace NaN with 0?', 'Only if zero is the correct domain value. Often `null` is safer for missing or impossible calculations.'],
        ['Does JSON.stringify allow NaN?', 'JavaScript `JSON.stringify` converts `NaN` to `null` in objects and arrays.'],
        ['Why does an API reject NaN?', 'Most APIs parse strict JSON, and strict JSON has no representation for `NaN`.'],
      ],
    }),
    guide({
      slug: 'unexpected-token-infinity-in-json',
      title: 'Unexpected Token Infinity in JSON: Fix Infinite Numbers',
      description: 'Fix Unexpected token Infinity in JSON errors by converting Infinity values to valid JSON numbers, null, or strings before sending data.',
      summary: 'Unexpected token Infinity in JSON means a JavaScript or calculation-specific value leaked into strict JSON text.',
      primaryKeyword: 'Unexpected token Infinity in JSON',
      invalidCode: `{
  "ratio": Infinity,
  "unit": "requests"
}`,
      fixedCode: `{
  "ratio": null,
  "unit": "requests"
}`,
      sections: [
        section('Why Infinity breaks JSON', [
          'Unexpected token Infinity in JSON appears when strict JSON text contains the word `Infinity` or `-Infinity`. JSON numbers can include digits, decimal points, signs, and exponents, but they cannot represent positive or negative infinity. The parser sees a letter where a valid value should start.',
          'This guide is for developers serializing calculations, metrics, rate limits, or analytics results. Infinite values often come from division by zero or unbounded calculations. JSON requires you to choose a portable representation before transport.',
        ]),
        section('Decide what infinity means', [
          'The correct repair depends on the meaning. If a ratio cannot be calculated, `null` may be correct. If a limit is intentionally unlimited, a string such as `"unlimited"` or a separate boolean field may communicate intent better than a fake large number. If the API expects a finite number, validate before sending.',
          'Avoid substituting a huge number just to satisfy JSON syntax. That can create hidden business bugs, especially in billing, rate limiting, pagination, and scoring systems where numeric meaning matters.',
        ]),
        section('Normalize values before serialization', [
          'Handle infinite values in code before producing JSON. In JavaScript, check `Number.isFinite(value)` before placing a number into a payload. In other languages, use the equivalent finite-number check. Then map invalid values to a documented representation that the receiving system accepts.',
          'A serializer can keep the JSON syntax valid, but it cannot decide your domain rule. That rule belongs in application code, tests, or schema validation so future data does not leak unsupported numeric values into public payloads.',
        ]),
        section('Validate both syntax and schema', [
          'After replacing `Infinity`, run JSON syntax validation and then verify the receiving schema. Syntax success only says the document is parseable; the API may still reject `null`, strings, or out-of-range numbers. Keep a small example in tests if the calculation edge case is important.',
          'When debugging an existing payload, use JSONFmt to confirm that `Infinity` is the syntax blocker. Then repair the source calculation or serialization step rather than editing every output manually.',
        ]),
      ],
      faq: [
        ['Is Infinity valid JSON?', 'No. Strict JSON does not allow `Infinity` or `-Infinity` as numeric values.'],
        ['What should I use instead of Infinity?', 'Use `null`, a documented string, or a finite number depending on what the value means for your application.'],
        ['How do I prevent Infinity in JavaScript JSON?', 'Check `Number.isFinite(value)` before serializing values into a JSON payload.'],
        ['Can an API accept Infinity?', 'Only if it documents a custom non-JSON format. Standard JSON APIs should not accept it.'],
      ],
    }),
    guide({
      slug: 'unexpected-token-undefined-in-json',
      title: 'Unexpected Token undefined in JSON: Convert Missing Values',
      description: 'Fix Unexpected token undefined in JSON errors by replacing JavaScript undefined with null, omitted fields, or real JSON values.',
      summary: 'Unexpected token undefined in JSON means JavaScript-only missing data was placed into text that a strict JSON parser must read.',
      primaryKeyword: 'Unexpected token undefined in JSON',
      invalidCode: `{
  "name": undefined,
  "active": true
}`,
      fixedCode: `{
  "name": null,
  "active": true
}`,
      sections: [
        section('Why undefined is not JSON', [
          'Unexpected token undefined in JSON happens because strict JSON has no `undefined` value. JavaScript uses `undefined` for variables or properties without a value, but JSON supports only `null` for explicit absence. A parser rejects the first `u` because it is not part of the JSON grammar.',
          'This guide is for developers converting JavaScript objects, form data, optional fields, or logs into JSON. The fix is not only syntactic. You must decide whether the missing value should be omitted, represented as `null`, or replaced with a real value.',
        ]),
        section('Choose omit, null, or a real value', [
          'If the field should not be sent when absent, omit the property. If the receiving API expects an explicit empty value, use `null` only when the API documents that meaning. If the field is required, collect or compute the real value before serialization instead of sending a placeholder.',
          'This decision affects downstream behavior. Some APIs treat omitted fields as unchanged, while `null` may clear a value. Other APIs reject `null` for required strings or numbers. Check the contract before changing `undefined` to anything else.',
        ]),
        section('Avoid manual JSON string construction', [
          'Manual string templates often leak `undefined` into JSON-looking text. For example, `"name": ${name}` becomes invalid when `name` is missing. Build an object first, normalize optional values, and then use a serializer. That keeps quotes, commas, and missing values under control.',
          'In JavaScript, `JSON.stringify` omits object properties whose value is `undefined` and converts `undefined` in arrays to `null`. Know that behavior before relying on it, because omitted properties and explicit nulls can mean different things.',
        ]),
        section('Validate the final payload', [
          'After repairing undefined values, validate the full JSON text. Then test the API or schema with the exact missing-value representation you chose. Syntax validation cannot tell whether omission or `null` matches your business rule.',
          'When you debug this in JSONFmt, paste the produced text, not the original JavaScript object. If the text contains `undefined`, fix the serialization step so future payloads do not need the same manual repair.',
        ]),
      ],
      faq: [
        ['Is undefined valid JSON?', 'No. Strict JSON does not include JavaScript `undefined`. Use `null`, omit the field, or provide a real value.'],
        ['Is null the same as undefined?', 'No. `null` is an explicit JSON value, while `undefined` is a JavaScript missing-value concept.'],
        ['What does JSON.stringify do with undefined?', 'It omits undefined object properties and converts undefined array items to `null`.'],
        ['Can I send undefined to an API?', 'Not in strict JSON. The request body must use valid JSON values.'],
      ],
    }),
    guide({
      slug: 'unterminated-string-literal-in-json',
      title: 'Unterminated string literal in JSON: Find the Broken Quote',
      description: 'Fix Unterminated string literal in JSON errors by locating missing quotes, raw line breaks, and unescaped quotes inside values.',
      summary: 'Unterminated string literal in JSON means a quoted value started but did not close correctly before the parser reached invalid text.',
      primaryKeyword: 'Unterminated string literal in JSON',
      invalidCode: `{
  "message": "User said "ok"",
  "status": "open"
}`,
      fixedCode: `{
  "message": "User said \\"ok\\"",
  "status": "open"
}`,
      sections: [
        section('What unterminated string literal means', [
          'Unterminated string literal in JSON means a string began with a double quote but the parser could not find the correct closing quote. The cause may be a missing quote, a literal line break inside the value, or an unescaped double quote that ends the string too early.',
          'This guide is for developers copying messages, logs, generated text, or API examples into strict JSON. The parser location may point after the actual mistake, so start with the first string that looks visually broken.',
        ]),
        section('Check quotes inside values', [
          'A quote inside a JSON string must be escaped as `\\"`. In the invalid example, the quote before `ok` closes the string early. The parser then sees `ok` and another quote where a comma or object boundary should appear. The text needs escaping, not a new property.',
          'This is common in chat messages, SQL snippets, shell commands, and copied error text. Do not remove meaningful quotes from the value unless the application truly does not need them. Escape the quote so the parsed string still contains the intended character.',
        ]),
        section('Check raw line breaks', [
          'A literal line break inside a JSON string can also create an unterminated string error. Use `\\n` to represent a line break inside the value. Keep normal line breaks outside strings for formatting; only line breaks inside a quoted value need escaping.',
          'If the JSON came from a log, the line may have wrapped visually or the actual text may contain a newline. Inspect raw text when possible so you know whether the line break is display wrapping or a real control character in the payload.',
        ]),
        section('Validate one repair at a time', [
          'Fix the first broken string boundary and validate again. One unterminated string can make the rest of the document look broken because the parser treats later keys and braces as part of the same string. Do not rewrite the entire object based on cascading syntax colors.',
          'After syntax validation passes, format the JSON and inspect whether the message value still contains the text you intended. Escaping should preserve meaning, not remove important characters from logs or user-visible strings.',
        ]),
      ],
      faq: [
        ['What causes Unterminated string literal in JSON?', 'A missing closing quote, unescaped quote, or raw line break inside a string value commonly causes it.'],
        ['How do I include quotes in a JSON string?', 'Escape each inner double quote as `\\"`.'],
        ['Can JSON strings contain line breaks?', 'They can contain line breaks represented as `\\n`, but not raw literal line breaks.'],
        ['Why do later lines look broken too?', 'The parser loses the string boundary and may treat later text as part of the same string.'],
      ],
    }),
    guide({
      slug: 'invalid-escape-character-in-json',
      title: 'Invalid escape character in JSON: Fix Backslashes Safely',
      description: 'Fix Invalid escape character in JSON errors by escaping backslashes, quotes, Windows paths, regex text, and control characters correctly.',
      summary: 'Invalid escape character in JSON means a backslash starts an escape sequence that strict JSON does not recognize.',
      primaryKeyword: 'Invalid escape character in JSON',
      invalidCode: `{
  "path": "C:\\new\\tools\\data.json",
  "pattern": "\\d+"
}`,
      fixedCode: `{
  "path": "C:\\\\new\\\\tools\\\\data.json",
  "pattern": "\\\\d+"
}`,
      sections: [
        section('Why escape characters fail', [
          'Invalid escape character in JSON appears when a backslash is followed by a character that is not one of the valid JSON escape forms. JSON allows escapes such as `\\"`, `\\\\`, `\\/`, `\\b`, `\\f`, `\\n`, `\\r`, `\\t`, and `\\uXXXX`. Other combinations are rejected.',
          'This guide is for developers working with Windows paths, regular expressions, shell commands, and copied strings. Backslashes often have meaning in the source context and in JSON, so they need careful treatment before the value is transported.',
        ]),
        section('Escape literal backslashes', [
          'If the parsed value should contain one backslash, the JSON text usually needs two. A Windows path such as `C:\\new\\tools` can be dangerous because `\\n` is a newline escape, not a backslash plus n. The portable JSON text should use doubled backslashes for path separators.',
          'Regular expressions have the same issue. If the application needs the regex text `\\d+`, the JSON string often needs `"\\\\d+"`. One layer represents JSON syntax, and the next layer represents the string consumed by the regex engine.',
        ]),
        section('Avoid fixing by deleting slashes', [
          'Deleting backslashes may make the JSON parse, but it can change the meaning of paths, regex patterns, escaped quotes, or command strings. The safe repair is to decide which characters should appear in the parsed value, then encode that value correctly as JSON text.',
          'When the string came from code, use a serializer. Serializers escape backslashes and quotes based on the actual string value. Manual escaping is useful for small examples, but generated strings should not be assembled by hand.',
        ]),
        section('Validate and inspect the parsed value', [
          'After repairing escapes, validate the JSON and inspect the parsed value in the consuming application. The JSON text and the runtime string are related but not identical. For example, `\\\\` in JSON text becomes one backslash after parsing.',
          'Use a minimal redacted sample when debugging escape issues. Long command strings and regex values can contain multiple escaping layers, so shrinking the example makes it easier to see which layer is failing.',
        ]),
      ],
      faq: [
        ['What escape sequences are valid in JSON?', 'JSON supports escapes such as `\\"`, `\\\\`, `\\n`, `\\t`, and Unicode escapes like `\\u0041`.'],
        ['How do I write a Windows path in JSON?', 'Escape each literal backslash, for example `"C:\\\\Users\\\\Ada"`.'],
        ['Should I remove invalid backslashes?', 'Only if the parsed value should not contain them. Usually you should escape literal backslashes instead.'],
        ['Why is regex JSON escaping confusing?', 'Regex and JSON both use backslashes, so the JSON text must preserve the string that the regex engine will later read.'],
      ],
    }),
    guide({
      slug: 'invalid-unicode-escape-in-json',
      title: 'Invalid Unicode escape in JSON: Fix \\uXXXX Sequences',
      description: 'Fix Invalid Unicode escape in JSON errors by checking that every Unicode escape uses exactly four hexadecimal digits.',
      summary: 'Invalid Unicode escape in JSON means a `\\u` sequence is incomplete or contains characters outside the four-digit hexadecimal form.',
      primaryKeyword: 'Invalid Unicode escape in JSON',
      invalidCode: `{
  "symbol": "\\u12G4"
}`,
      fixedCode: `{
  "symbol": "\\u2603"
}`,
      sections: [
        section('What a Unicode escape requires', [
          'Invalid Unicode escape in JSON means the parser saw `\\u` but the following characters did not form exactly four hexadecimal digits. Valid hex digits are `0-9`, `a-f`, and `A-F`. A sequence such as `\\u12G4` fails because `G` is not a hexadecimal digit.',
          'This guide is for developers handling copied symbols, encoded text, localization files, or generated JSON. Unicode escaping is precise. A missing digit or wrong character makes the whole JSON document invalid until the escape is repaired.',
        ]),
        section('Check for incomplete escapes', [
          'A common mistake is a truncated escape such as `\\u12` or a backslash copied before a normal letter. JSON does not treat `\\u` as a general marker. It must be followed by four valid hex digits every time. If you do not need an escape, use the actual character or escape the backslash itself.',
          'For many modern workflows, storing the actual UTF-8 character is valid JSON and easier to read. Escapes are useful when a tool requires ASCII-only text or when representing control characters, but they are not required for ordinary Unicode characters.',
        ]),
        section('Be careful with surrogate pairs', [
          'Characters outside the basic multilingual plane may be represented by two `\\uXXXX` sequences called a surrogate pair. Each half still needs four valid hexadecimal digits. If one half is missing or malformed, parsers may reject the string or produce the wrong character.',
          'When generated data contains emoji or rare symbols, let a serializer produce the JSON. Manual Unicode escaping is easy to get wrong, especially when copying from documentation, terminals, or legacy systems with different encodings.',
        ]),
        section('Validate after encoding changes', [
          'After fixing a Unicode escape, validate the full JSON document and inspect the rendered value in the application that consumes it. Syntax validity proves the escape format is legal; it does not prove that the resulting character is the one you intended.',
          'If the error appears after a network transfer, compare raw bytes or source files. Encoding conversion, copied text, and escaping in templates can all change backslashes before the JSON parser sees them.',
        ]),
      ],
      faq: [
        ['What is a valid JSON Unicode escape?', 'It is `\\u` followed by exactly four hexadecimal digits, such as `\\u2603`.'],
        ['Can JSON contain actual Unicode characters?', 'Yes. JSON can contain Unicode characters directly when the text is encoded correctly.'],
        ['What makes a Unicode escape invalid?', 'Missing digits or non-hex characters after `\\u` make the escape invalid.'],
        ['Should I manually write Unicode escapes?', 'Use a serializer when possible. Manual escapes are easy to mistype.'],
      ],
    }),
    guide({
      slug: 'unexpected-token-bom-in-json',
      title: 'Unexpected Token BOM in JSON: Remove Hidden Characters',
      description: 'Fix Unexpected token BOM in JSON errors by removing byte order marks and hidden characters before strict JSON parsing.',
      summary: 'Unexpected token BOM in JSON usually means an invisible byte order mark appears before the first JSON character.',
      primaryKeyword: 'Unexpected token BOM in JSON',
      invalidCode: `\uFEFF{
  "status": "ok"
}`,
      fixedCode: `{
  "status": "ok"
}`,
      sections: [
        section('What a BOM is', [
          'Unexpected token BOM in JSON usually means a byte order mark appears at the start of the text before the opening `{` or `[`. A BOM is an invisible character used by some tools to mark encoding. Many JSON parsers handle UTF-8 without needing it, and some reject it as an unexpected character.',
          'This guide is for developers parsing files copied between Windows editors, build tools, APIs, and command-line scripts. The JSON can look correct on screen while a hidden character before the first token causes parsing to fail.',
        ]),
        section('Find hidden characters at the start', [
          'If the first visible character is `{` but the parser reports an unexpected token at position 0, suspect an invisible character. Open the file in an editor that can show encoding or invisible characters, or inspect the first bytes. A UTF-8 BOM appears as `EF BB BF` before the text.',
          'The fix is to save the file as UTF-8 without BOM or strip the BOM before parsing. Do not change the JSON values themselves until you confirm whether the hidden prefix is the actual blocker.',
        ]),
        section('Handle BOMs in file pipelines', [
          'If many files have this problem, add a cleanup step at the file boundary. Strip a leading BOM from raw text before passing it to a strict parser, or configure the editor/exporter to write UTF-8 without BOM. Keep the cleanup narrow so it removes only the leading marker and not meaningful characters elsewhere.',
          'In server code, log only safe metadata when investigating encoding problems. The issue is at the byte boundary, so you can often diagnose it from the first few bytes, content type, or file source without exposing the full private payload.',
        ]),
        section('Validate after removing the marker', [
          'After removing the BOM, validate the full JSON. The hidden character may have been the only issue, but a copied or converted file can also contain bad escapes, raw control characters, or truncation. One clean validation pass confirms the text is now strict JSON.',
          'When you paste into JSONFmt, the visible editor may not make a BOM obvious. If the text still fails at the first position, re-create the sample without hidden leading characters and compare the result.',
        ]),
      ],
      faq: [
        ['What is a BOM in JSON?', 'It is a hidden byte order mark that may appear before the first visible character of a file.'],
        ['Why does BOM cause JSON parsing errors?', 'Some strict parsers reject the hidden leading character because it is not part of the JSON value.'],
        ['How do I remove a BOM?', 'Save the file as UTF-8 without BOM or strip the leading marker before parsing.'],
        ['Can a BOM appear in copied text?', 'Yes. It can come from editors, exports, or file conversions even when the JSON looks normal.'],
      ],
    }),
    guide({
      slug: 'empty-response-json-parse-error',
      title: 'Empty response JSON parse error: Check Status and Body',
      description: 'Fix Empty response JSON parse error cases by checking 204 responses, empty bodies, and clients that parse before verifying content.',
      summary: 'Empty response JSON parse error happens when code tries to parse an empty body as though it contained JSON text.',
      primaryKeyword: 'Empty response JSON parse error',
      invalidCode: ``,
      fixedCode: `{
  "status": "ok"
}`,
      sections: [
        section('Why empty bodies fail parsing', [
          'Empty response JSON parse error happens when a client calls a JSON parser on a body with no text. Strict JSON can represent `null`, `{}`, or `[]`, but it cannot parse nothing. An empty string is not a JSON value, so the parser reports an unexpected end or similar message.',
          'This guide is for developers debugging `response.json()`, backend clients, webhooks, and API tests. The key question is whether the server should send JSON for that status, or whether the client should skip parsing when no body is expected.',
        ]),
        section('Check HTTP status codes', [
          'A `204 No Content` response should not have a JSON body. If your client always calls `response.json()`, it will fail on a perfectly valid empty response. A `304 Not Modified` response can create similar expectations. Handle these statuses before attempting to parse the body.',
          'For status codes that should return data, an empty body may indicate a server bug, proxy issue, timeout, or middleware path that ended the response early. Inspect the raw response, headers, and server logs rather than patching the parser error alone.',
        ]),
        section('Use content checks before parsing', [
          'A defensive client checks whether the response has content before parsing. You can inspect status, `Content-Length`, content type, or read text and handle an empty string explicitly. The exact approach depends on your framework and whether reading the body consumes the stream.',
          'Do not turn every empty body into `{}` unless the API contract says that is correct. Empty object, empty array, null, and no body can all mean different things to the client application.',
        ]),
        section('Return consistent API shapes', [
          'If you control the API, document which endpoints return bodies and which do not. For JSON endpoints, return `application/json` and a clear JSON body for errors. For no-content actions, return a status such as 204 and make sure clients treat it as no body.',
          'After you capture a raw non-empty JSON sample, validate it in JSONFmt. If the sample is empty, the fix belongs in request handling or response handling rather than syntax repair.',
        ]),
      ],
      faq: [
        ['Is an empty string valid JSON?', 'No. JSON must contain one complete value such as `null`, `{}`, `[]`, a string, number, boolean, object, or array.'],
        ['Should I parse a 204 response as JSON?', 'No. A 204 response means no content and should be handled without JSON parsing.'],
        ['What should an API return for no data?', 'That depends on the contract. It might return 204, `null`, `{}`, or `[]`, but the client and server must agree.'],
        ['Why does response.json fail on an empty response?', 'It tries to parse an empty body as JSON text, and there is no JSON value to parse.'],
      ],
    }),
    guide({
      slug: 'response-json-is-not-a-function',
      title: 'response.json is not a function: Fix Fetch Parsing',
      description: 'Fix response.json is not a function errors by checking whether your code has a Fetch Response, parsed data, or a custom client result.',
      summary: 'response.json is not a function means the value named `response` is not a Fetch Response object with a `.json()` method.',
      primaryKeyword: 'response.json is not a function',
      invalidCode: `const response = { status: "ok" }
await response.json()`,
      fixedCode: `const response = await fetch("/api/status")
const data = await response.json()`,
      sections: [
        section('What the error means', [
          'response.json is not a function is a JavaScript runtime error, not a JSON syntax error. It means the variable named `response` does not have a `.json()` method. The value may already be parsed data, an Axios response, a plain object, a mocked value, or something returned by a custom client.',
          'This guide is for developers debugging frontend fetch code, tests, and API wrappers. Before changing JSON syntax, inspect the actual type and shape of the value. The parser method exists only on specific response objects.',
        ]),
        section('Fetch and custom clients differ', [
          'The browser Fetch API returns a `Response` object whose body methods include `.json()` and `.text()`. Axios and many SDKs return an object where parsed data is already available on a property such as `data`. Calling `.json()` on those objects fails because the parsing already happened or the API shape is different.',
          'Check the client documentation and avoid mixing patterns. If you use Fetch, call `await response.json()`. If you use Axios, read `response.data`. If you use a wrapper, learn whether it returns raw text, a parsed object, or the original response.',
        ]),
        section('Watch for variable shadowing', [
          'This error can also happen when a variable named `response` is reassigned. For example, a test may replace a Fetch response with a plain object, or earlier code may assign `response = await response.json()`. After that assignment, `response` is data, not a response object.',
          'Use clear variable names such as `rawResponse` and `data` to separate the HTTP response from the parsed JSON value. That naming habit prevents double parsing and makes stack traces easier to read.',
        ]),
        section('Validate only the raw JSON text', [
          'JSONFmt is useful after you have raw JSON text or a string body. It cannot fix a JavaScript object that lacks a method. First correct the code path so you know where parsing should happen. Then validate the actual response body if the parser reports a syntax error.',
          'If the raw response is HTML, empty, or malformed JSON, use the relevant JSONFmt guide for that parser issue. If the raw response is valid but `.json()` is missing, the problem is client API usage rather than JSON content.',
        ]),
      ],
      faq: [
        ['Is response.json is not a function a JSON syntax error?', 'No. It is a JavaScript runtime error caused by calling `.json()` on the wrong kind of value.'],
        ['Why does Axios response.json fail?', 'Axios usually exposes parsed data as `response.data`, not a Fetch-style `.json()` method.'],
        ['How do I know if I have a Fetch Response?', 'Inspect the value type and check whether it has methods such as `.json()`, `.text()`, and properties such as `ok` and `status`.'],
        ['Can JSONFmt fix this error?', 'JSONFmt can validate raw JSON text, but the missing method must be fixed in your JavaScript code.'],
      ],
    }),
    guide({
      slug: 'body-stream-already-read-json',
      title: 'body stream already read JSON: Parse the Response Once',
      description: 'Fix body stream already read JSON errors by reading fetch response bodies once and storing parsed data instead of rereading streams.',
      summary: 'body stream already read JSON means code tried to consume a Fetch response body after it had already been read.',
      primaryKeyword: 'body stream already read JSON',
      invalidCode: `const data = await response.json()
const raw = await response.text()`,
      fixedCode: `const raw = await response.text()
const data = JSON.parse(raw)`,
      sections: [
        section('Why response bodies can be read once', [
          'body stream already read JSON errors happen because a Fetch response body is a stream. Once code consumes it with `.json()`, `.text()`, `.blob()`, or another body reader, the same stream cannot be consumed again. A second read fails even if the original JSON was valid.',
          'This guide is for developers debugging fetch code that logs raw responses and also parses JSON. The failure is about stream handling, not necessarily about JSON syntax. Decide which representation you need before reading the body.',
        ]),
        section('Choose text first when debugging', [
          'If you need to inspect the raw body and parse it, read the body as text once, store the text, and then call `JSON.parse(raw)` on that stored string. This gives you both the raw debugging value and the parsed object without trying to consume the network stream twice.',
          'Be careful with large or private payloads. Store only what you need, redact sensitive values before logging, and avoid sending full production bodies to analytics or shared debugging tools.',
        ]),
        section('Use clone only when appropriate', [
          'Fetch responses can sometimes be cloned before reading, allowing separate consumers to read separate streams. That can be useful in middleware, caching, or logging, but it is not a substitute for a clear data flow. Cloning large responses can also increase memory use.',
          'For normal application code, a simpler pattern is usually better: read once, name the result clearly, and pass the parsed data forward. Keep raw text only for error handling or debugging paths that truly need it.',
        ]),
        section('Separate stream errors from JSON errors', [
          'If the first read succeeds but parsing fails, then you have a JSON syntax or response-format problem. If the second read fails before parsing, then you have a stream consumption problem. These two failures need different fixes, so check where the exception is thrown.',
          'After you capture raw text once, paste a redacted sample into JSONFmt to validate the JSON. That keeps the syntax investigation separate from fetch stream lifecycle issues.',
        ]),
      ],
      faq: [
        ['Why can I not call response.json twice?', 'The Fetch response body is a stream, and body streams are consumed when read.'],
        ['How can I log and parse the same response?', 'Read text once, log a redacted sample if needed, and parse the stored text with `JSON.parse`.'],
        ['Is body stream already read a JSON syntax issue?', 'No. It is a response-body lifecycle issue. JSON syntax may still be valid.'],
        ['Should I use response.clone?', 'Use it only when you need separate stream consumers and understand the memory and lifecycle tradeoffs.'],
      ],
    }),
    guide({
      slug: 'unexpected-non-whitespace-character-after-json',
      title: 'Unexpected Non-Whitespace Character After JSON: Fix Extra Data',
      description: 'Fix unexpected non-whitespace character after JSON errors by removing logs, concatenated values, or extra text after the first JSON document.',
      summary: 'Unexpected non-whitespace character after JSON means the parser finished one value and found extra data after it.',
      searchAnswer: 'The parser finished one valid JSON value and then found extra non-whitespace text. Remove the second value, log prefix, or trailing response data.',
      fixSteps: [
        'Find the first complete object, array, string, number, boolean, or null value.',
        'Remove logs, concatenated JSON, HTML, or other characters after that value.',
        'If multiple JSON values are intentional, parse a documented stream format instead of one JSON document.',
      ],
      primaryKeyword: 'Unexpected non-whitespace character after JSON',
      invalidCode: `{"status":"ok"}{"next":true}`,
      fixedCode: `{
  "status": "ok",
  "next": true
}`,
      sections: [
        section('What the message means', [
          'Unexpected non-whitespace character after JSON means the parser successfully read one complete JSON value, then found additional text that was not whitespace. Strict JSON documents contain exactly one top-level value. Two objects placed back to back are not one valid JSON document.',
          'This guide is for developers working with concatenated logs, streaming output, copied console text, and generated files. The first object may be valid, but the combined text is not a single strict JSON payload.',
        ]),
        section('Look for concatenated JSON values', [
          'A common example is `{"status":"ok"}{"next":true}`. Each object can be valid alone, but together they need a wrapper such as an array or a single object containing both pieces. The parser finishes the first `}` and rejects the next `{` because the document should have ended.',
          'If the source is a log stream, the format may be newline-delimited JSON rather than a single JSON document. NDJSON is useful for logs, but it must be processed line by line, not with one `JSON.parse` call over the whole file.',
        ]),
        section('Remove logs and labels around JSON', [
          'Extra characters can also come from prefixes such as `payload:` or suffixes such as debugging notes. A parser needs only the JSON value. Remove labels, timestamps, prompts, and console output before validating the payload as strict JSON.',
          'When copying from a terminal or browser console, copy the raw response body instead of the formatted log line. Many logging tools add metadata around the JSON that belongs to the log format, not to the payload itself.',
        ]),
        section('Choose the right container', [
          'If you really need multiple records in one JSON document, wrap them in an array or object. For example, use `[{"status":"ok"},{"next":true}]` for a list of records, or merge fields into one object when they describe the same entity.',
          'After changing the container, validate the full document and confirm the receiving system expects that shape. A syntax-valid array is not interchangeable with a single object if the API contract expects one specific root type.',
        ]),
      ],
      relatedGuideSlugs: [
        'extra-data-after-json',
        'body-stream-already-read-json',
        'truncated-json-response',
      ],
      faq: [
        ['Can a JSON file contain two objects back to back?', 'No. Strict JSON has exactly one top-level value. Use an array or process records line by line if needed.'],
        ['What is extra data after JSON?', 'It is any non-whitespace text that appears after the first complete JSON value.'],
        ['Is NDJSON the same as JSON?', 'No. NDJSON stores one JSON value per line and must be parsed line by line.'],
        ['How do I fix concatenated JSON?', 'Wrap records in an array, merge them into one object, or parse each record separately depending on the use case.'],
      ],
    }),
    guide({
      slug: 'duplicate-keys-in-json',
      title: 'Duplicate keys in JSON: Why They Are Risky',
      description: 'Understand Duplicate keys in JSON, why parsers may keep the last value, and how to remove ambiguity before sending payloads.',
      summary: 'Duplicate keys in JSON can parse in many tools, but they create ambiguity because consumers may keep different values.',
      primaryKeyword: 'Duplicate keys in JSON',
      invalidCode: `{
  "role": "reader",
  "role": "admin"
}`,
      fixedCode: `{
  "role": "admin"
}`,
      sections: [
        section('Why duplicate keys are dangerous', [
          'Duplicate keys in JSON mean the same object property name appears more than once at the same level. Some parsers accept the syntax and keep the last value. Others may keep the first value or report a warning. Even when parsing succeeds, the data is ambiguous to humans and systems.',
          'This guide is for developers reviewing API payloads, configuration files, and security-sensitive data. Duplicate keys are especially risky for permissions, prices, feature flags, and identifiers because a reviewer may see one value while the application uses another.',
        ]),
        section('Strict syntax versus data quality', [
          'The JSON grammar does not always make duplicate keys a syntax error in every parser, but many style guides and schemas reject them as invalid data. A syntax validator may parse the object, while a schema validator or application rule may still reject it. Treat duplicates as a data-quality bug.',
          'If your tool allows duplicate keys, do not assume the payload is safe. Inspect the object and decide which value is intended. Remove the duplicate or remodel the data as an array when multiple values are truly required.',
        ]),
        section('Fix duplicates deliberately', [
          'Do not merge duplicate keys mechanically. If two `role` properties disagree, the correct value depends on the business rule. If two `headers` objects repeat a key, decide whether the last one should override or whether both came from a mistaken merge.',
          'When duplicates come from code, find the merge operation that produced them. Object spreading, template generation, and string concatenation can all create repeated keys when optional fields are appended without checking existing properties.',
        ]),
        section('Add checks for critical payloads', [
          'For configuration and security-sensitive JSON, add duplicate-key checks in tests or CI if your parser supports them. Standard parsing may silently keep one value, which hides the issue. A dedicated lint or schema step can make duplicates visible before release.',
          'After removing duplicates, format the JSON and review nearby keys. Duplicate properties often appear after manual edits or generated merges, and the same edit may have introduced missing commas or unexpected nesting.',
        ]),
      ],
      faq: [
        ['Are duplicate keys valid JSON?', 'Many parsers accept them, but they are ambiguous and should be treated as a data-quality problem.'],
        ['Which duplicate key value does JavaScript keep?', 'JavaScript parsing commonly keeps the last value for a repeated object key.'],
        ['Should a validator flag duplicate keys?', 'A strict data-quality checker should flag them, especially for configuration and security-sensitive payloads.'],
        ['How do I fix duplicate keys?', 'Choose the intended value, remove the repeated property, or remodel the data as an array if multiple values are needed.'],
      ],
    }),
    guide({
      slug: 'extra-data-after-json',
      title: 'Extra data after JSON: Fix Multiple Values and Logs',
      description: 'Fix Extra data after JSON errors by removing log text, wrapping multiple JSON records, or parsing newline-delimited JSON correctly.',
      summary: 'Extra data after JSON means a parser found more content after the first complete JSON value ended.',
      primaryKeyword: 'Extra data after JSON',
      invalidCode: `{
  "event": "start"
}
{
  "event": "stop"
}`,
      fixedCode: `[
  {
    "event": "start"
  },
  {
    "event": "stop"
  }
]`,
      sections: [
        section('What extra data means', [
          'Extra data after JSON means the parser reached the end of one valid JSON value and then found another non-whitespace character. This is common when two JSON objects are pasted together, when a log file contains one object per line, or when a response includes debugging text before or after the payload.',
          'This guide is for developers using Python, command-line tools, API clients, and validators that expect one strict JSON document. The repair depends on whether you have one payload with noise or multiple records that need a different format.',
        ]),
        section('Decide whether there are multiple records', [
          'If the text contains several independent objects, you can wrap them in an array when the consumer expects one JSON document. If the file is newline-delimited JSON, parse it line by line instead of forcing the whole file into one JSON value. NDJSON is useful but not the same as a JSON array.',
          'If the extra data is a timestamp, log level, prompt, or stack trace, remove that surrounding text before validation. The parser needs only the JSON payload, not the transport or logging wrapper around it.',
        ]),
        section('Do not delete data blindly', [
          'Deleting everything after the first closing brace may make the first object parse, but it might throw away meaningful records. Check the source and decide whether the later content should become part of an array, a separate document, or a separate line-based stream.',
          'When data is generated by an exporter, configure the exporter to produce the format you need. A single JSON API response, a JSON array export, and NDJSON each have different parsing expectations.',
        ]),
        section('Validate the intended final format', [
          'After wrapping records or removing log text, validate the complete final document. If the consumer expects an array, test an array. If the consumer expects one object, do not send a list of records just because it parses.',
          'JSONFmt can validate the strict JSON document you intend to send. For NDJSON, validate one line at a time or convert the lines into an array before using a standard JSON parser.',
        ]),
      ],
      faq: [
        ['What causes Extra data after JSON?', 'Multiple JSON values, logs, labels, or other non-whitespace text after the first JSON value commonly cause it.'],
        ['Can JSON contain multiple top-level objects?', 'No. Use an array or parse records separately.'],
        ['Is NDJSON valid JSON?', 'Each line can be valid JSON, but the whole file is not one standard JSON document unless wrapped in an array.'],
        ['How do I fix extra data after JSON?', 'Remove non-payload text or wrap multiple records in the structure expected by the consuming system.'],
      ],
    }),
    guide({
      slug: 'unexpected-token-object-object-in-json',
      title: 'Unexpected Token object Object in JSON: Fix Stringified Objects',
      description: 'Fix Unexpected token object Object in JSON by preventing implicit object-to-string conversion and using JSON.stringify correctly.',
      summary: 'Unexpected token object Object in JSON usually means a real object was converted into the string `[object Object]` before parsing.',
      primaryKeyword: 'Unexpected token object Object in JSON',
      invalidCode: `{
  "payload": [object Object]
}`,
      fixedCode: `{
  "payload": {
    "id": 123
  }
}`,
      sections: [
        section('What [object Object] tells you', [
          'Unexpected token object Object in JSON means the text contains a JavaScript object string representation instead of JSON syntax. `[object Object]` is what many plain objects become when they are coerced to a string. It is not a serialized object and it does not contain recoverable key-value data.',
          'This guide is for developers debugging templates, logs, form submissions, query parameters, and storage values. The object existed earlier, but it was converted incorrectly before it reached the JSON parser.',
        ]),
        section('Find the implicit conversion', [
          'Look for string concatenation, template literals, URL building, or DOM assignment that inserts an object directly into text. For example, `${payload}` does not produce JSON for a plain object. It usually produces `[object Object]`, which later fails if another layer tries to parse it as JSON.',
          'The fix is to use `JSON.stringify(payload)` when you need JSON text, or keep the object as an object when the next step can accept structured data. Avoid converting to text and parsing back unless a real boundary requires serialized JSON.',
        ]),
        section('Preserve nested objects correctly', [
          'If a JSON field should contain an object, the text must include braces and quoted keys. `"payload": {"id":123}` is valid. `"payload": [object Object]` is not. If the field should contain a JSON string, then the serialized object must be escaped as a string value, which is a different contract.',
          'Clarify whether the receiver expects a nested object or a string containing JSON. Sending the wrong representation can parse successfully but still fail schema validation or application logic.',
        ]),
        section('Validate at the boundary', [
          'After changing serialization, validate the exact text sent over the boundary. This could be a request body, local storage value, queue message, or generated file. JSONFmt can confirm the syntax, while your application tests confirm the receiver expects the chosen structure.',
          'If the raw text still contains `[object Object]`, the earlier object conversion has not been fixed. Move back through the pipeline until you find where the structured value becomes a string.',
        ]),
      ],
      faq: [
        ['Is [object Object] valid JSON?', 'No. It is a JavaScript object string representation, not JSON syntax.'],
        ['How do I serialize an object as JSON?', 'Use `JSON.stringify(objectValue)` at the boundary where JSON text is required.'],
        ['Can I recover data from [object Object]?', 'Usually no. The original keys and values were lost when the object was converted to that string.'],
        ['Why does a template literal produce [object Object]?', 'Plain objects use their default string conversion unless you explicitly serialize them.'],
      ],
    }),
    guide({
      slug: 'truncated-json-response',
      title: 'Truncated JSON response: Find Missing Ending Data',
      description: 'Fix Truncated JSON response errors by checking incomplete API bodies, streaming failures, copy limits, and missing closing braces.',
      summary: 'Truncated JSON response means the body ended before the complete JSON value was delivered or copied.',
      primaryKeyword: 'Truncated JSON response',
      invalidCode: `{
  "items": [
    { "id": 1 },
    { "id": 2 }
  ],
  "nextPage":`,
      fixedCode: `{
  "items": [
    { "id": 1 },
    { "id": 2 }
  ],
  "nextPage": null
}`,
      sections: [
        section('How truncation appears', [
          'Truncated JSON response errors usually appear as unexpected end of input, unclosed string, or missing closing brace messages. The parser reaches the end while still expecting a value, bracket, brace, or quote. The syntax near the start can be valid, but the body is incomplete.',
          'This guide is for developers debugging API responses, logs, copied payloads, proxies, and streaming endpoints. The missing piece might be caused by manual copying or by a transport problem before the client receives the full body.',
        ]),
        section('Check whether the body is complete', [
          'Compare the raw response length with the expected content length when that header is available. Check server logs, proxy timeouts, compression errors, and client aborts. A response can be cut off by infrastructure even when the server code produced valid JSON originally.',
          'Manual copying can also truncate JSON. Browser consoles, log viewers, and terminals may collapse or limit long output. If you copied from a UI, use a download or raw response view when possible.',
        ]),
        section('Do not invent missing values', [
          'Adding a brace can make an incomplete sample parse, but it may not restore the intended data. If the response ends after a colon or in the middle of a string, the missing value matters. Go back to the source when the payload is production data or affects application behavior.',
          'For a small diagnostic sample, it is fine to create a minimal fixed example that shows the shape. Label it as a repaired sample so no one treats it as the original response.',
        ]),
        section('Prevent repeated truncation', [
          'For generated JSON, write the response through a serializer and let the server framework handle content length. For streaming JSON, consider NDJSON or chunk-aware parsing instead of sending one huge array that cannot be used until the final bracket arrives.',
          'After capturing a complete body, validate it in JSONFmt and then format it for review. If the complete body validates while the client still fails, inspect client stream handling or double-reading issues separately.',
        ]),
      ],
      faq: [
        ['What is a truncated JSON response?', 'It is an incomplete response body that ends before the JSON value is fully closed.'],
        ['How do I know if JSON was truncated?', 'Look for unexpected end errors and compare raw body length, final characters, and server/proxy logs.'],
        ['Can I fix truncation by adding a brace?', 'Only for a sample. For real data, retrieve the complete response so missing values are not invented.'],
        ['What causes API JSON truncation?', 'Timeouts, proxy errors, client aborts, log limits, copy limits, and streaming issues can all cut off JSON.'],
      ],
    }),
    guide({
      slug: 'missing-comma-in-json-array',
      title: 'Missing comma in JSON array: Fix Array Separators',
      description: 'Fix Missing comma in JSON array errors by adding separators between array items without creating trailing commas.',
      summary: 'Missing comma in JSON array means two array values appear next to each other without the separator strict JSON requires.',
      primaryKeyword: 'Missing comma in JSON array',
      invalidCode: `[
  "read"
  "write",
  "delete"
]`,
      fixedCode: `[
  "read",
  "write",
  "delete"
]`,
      sections: [
        section('What the array error means', [
          'Missing comma in JSON array means one array item ended and another item started without a comma between them. The parser may highlight the next string, number, object, or bracket because that is where it expected a separator or the end of the array.',
          'This guide is for developers editing permissions, lists, configuration arrays, fixtures, and API examples. The rule is simple: commas go between array items, never before the first item and never after the last item.',
        ]),
        section('Find the previous complete value', [
          'When the parser highlights an item, inspect the item immediately before it. If the previous value is complete and the array continues, add a comma after the previous value. This applies to strings, numbers, booleans, null, objects, and nested arrays.',
          'For arrays of objects, the missing comma often belongs after a closing brace. For arrays of strings, it belongs after the closing quote of the previous string. The highlighted next value is usually valid by itself; the separator is what is missing.',
        ]),
        section('Avoid creating trailing commas', [
          'After adding a missing comma, check the end of the array. A common follow-up mistake is leaving a comma after the final item, which strict JSON rejects. Commas separate values; they do not mark every line.',
          'Formatting can make array separators easier to inspect, but only after the JSON is valid. Repair the first missing separator, validate again, and then format the final array for review.',
        ]),
        section('Prefer generated arrays for large data', [
          'Large arrays are easy to break by hand. If the data comes from code, build the array in the programming language and serialize it instead of concatenating strings. Serializers know where separators belong and prevent both missing comma and trailing comma errors.',
          'For hand-written examples, keep one item per line during editing. That makes missing separators easier to see during code review and keeps future additions from breaking the array silently.',
        ]),
      ],
      faq: [
        ['Where do commas go in a JSON array?', 'They go between items only. There is no comma before the first item or after the last item.'],
        ['Why does the parser highlight the next array item?', 'The previous item was complete, so the parser expected a comma before the next value began.'],
        ['Can arrays contain objects and arrays?', 'Yes. Every item, including nested objects or arrays, still needs separators between neighboring items.'],
        ['How do I avoid array comma mistakes?', 'Generate arrays with a serializer when possible and validate after manual edits.'],
      ],
    }),
    guide({
      slug: 'leading-zero-in-json-number',
      title: 'Leading zero in JSON number: Fix Invalid Numeric Values',
      description: 'Fix Leading zero in JSON number errors by removing invalid prefixes or converting identifiers to strings when zeros matter.',
      summary: 'Leading zero in JSON number means a numeric literal starts with zero in a form strict JSON does not allow.',
      primaryKeyword: 'Leading zero in JSON number',
      invalidCode: `{
  "month": 08,
  "zip": 02110
}`,
      fixedCode: `{
  "month": 8,
  "zip": "02110"
}`,
      sections: [
        section('Why leading zeros are invalid', [
          'Leading zero in JSON number errors happen because strict JSON numbers cannot use forms such as `08` or `02110`. A number can be zero itself, or it can start with a non-zero digit. Leading zeros create ambiguity with old octal notation and are not part of the JSON grammar.',
          'This guide is for developers editing dates, codes, ZIP codes, IDs, and generated numeric fields. The right fix depends on whether the value is a true number or an identifier where the zero must be preserved.',
        ]),
        section('Remove zeros from real numbers', [
          'If the value is a real numeric quantity, remove the leading zero. For example, month `08` should become `8` when the receiving system expects a number. The parsed value is the same quantity without the invalid representation.',
          'Do not add quotes just to make the parser happy if the schema expects a number. A quoted number is a string, and APIs often treat strings and numbers differently even when they look similar on screen.',
        ]),
        section('Use strings for identifiers', [
          'If the leading zero is part of an identifier, use a string. ZIP codes, product codes, account IDs, and fixed-width values often need leading zeros. In those cases, `"02110"` is correct because the value is not meant for numeric arithmetic.',
          'This decision should match the API contract or database schema. A value can be syntax-valid as either a number or string, but only one representation may be semantically correct for the system receiving it.',
        ]),
        section('Validate numeric formats after repair', [
          'After fixing leading zeros, validate the JSON syntax and then check schema rules. Strict JSON validation will confirm that `8` and `"02110"` parse, but it cannot decide whether a field should be numeric or textual.',
          'When the issue comes from generated code, update the serializer input types. Treat identifiers as strings before serialization so leading zeros are not lost or emitted as invalid numeric literals.',
        ]),
      ],
      faq: [
        ['Are leading zeros allowed in JSON numbers?', 'No. Strict JSON numbers cannot have leading zeros such as `08` or `001`.'],
        ['How should I store a ZIP code in JSON?', 'Use a string if leading zeros are meaningful, for example `"02110"`.'],
        ['Is `"08"` a number in JSON?', 'No. It is a string containing digits. That may be correct for identifiers but not for numeric quantities.'],
        ['Why does JSON reject 08?', 'The JSON number grammar does not allow that representation. Use `8` for a number.'],
      ],
    }),
    guide({
      slug: 'content-type-text-html-json-error',
      title: 'Content-Type text/html JSON error: API Returned HTML',
      description: 'Fix Content-Type text/html JSON error cases by checking headers, redirects, login pages, and endpoints before parsing JSON.',
      summary: 'Content-Type text/html JSON error means the response header says HTML, even though client code expects JSON.',
      primaryKeyword: 'Content-Type text/html JSON error',
      invalidCode: `Content-Type: text/html

<!doctype html>
<html>
  <body>Login required</body>
</html>`,
      fixedCode: `Content-Type: application/json

{
  "error": "Login required",
  "status": 401
}`,
      sections: [
        section('What the content type tells you', [
          'Content-Type text/html JSON error means the server says the response body is HTML while your client is treating it as JSON. The parser may later report unexpected token `<`, but the header already gave the clue. The client and server disagree about the response format.',
          'This guide is for developers debugging fetch calls, API routes, proxies, redirects, and authentication failures. Before editing JSON, check status, headers, final URL, and raw body. The body may be a login page or error document, not malformed JSON.',
        ]),
        section('Common causes of HTML responses', [
          'A wrong route can return an HTML app shell or a 404 page. A missing auth token can redirect to a login page. A server error can produce a framework HTML error screen. A proxy can send the request to the frontend server instead of the API server.',
          'All of these cases create parser errors only because the client parses blindly. The real fix is to route the request correctly, return JSON from API error paths, or handle non-JSON responses before parsing.',
        ]),
        section('Check before response.json', [
          'Client code should check status and content type before calling `response.json()` when failures are possible. If the content type does not include `application/json`, read text for a diagnostic or show a clear error. This produces a better message than letting the parser fail on HTML.',
          'Do not trust file extensions or route names alone. Inspect the actual response. Redirects and server middleware can change the final body even when the original request URL looks correct.',
        ]),
        section('Return JSON errors from APIs', [
          'If you control the API, return JSON for API errors too. A 401, 404, or 500 response can still have `Content-Type: application/json` and a body such as `{"error":"Login required"}`. That lets clients handle errors without switching parsing modes.',
          'After you obtain a real JSON body, validate it in JSONFmt. If the response remains HTML, fix the endpoint, authentication, or proxy configuration first; the payload is not a JSON document yet.',
        ]),
      ],
      faq: [
        ['Why did I get Content-Type text/html instead of JSON?', 'The request likely reached an HTML page, login redirect, frontend app, or server error page instead of a JSON API response.'],
        ['Should I call response.json on text/html?', 'No. Check the content type and read text or handle the error before parsing as JSON.'],
        ['Can an error response still be JSON?', 'Yes. APIs should often return JSON error bodies with the correct status code and content type.'],
        ['How is this related to unexpected token <?', 'HTML bodies usually start with `<`, so blindly parsing HTML as JSON often triggers unexpected token `<`.'],
      ],
    }),
  ].map(expandPhase2GuideDepth)
}

function expandPhase2GuideDepth(page) {
  return {
    ...page,
    sections: page.sections.map((item, index) => {
      if (index !== page.sections.length - 1) return item

      return {
        ...item,
        paragraphs: [
          ...item.paragraphs,
          `For ${page.primaryKeyword}, keep a small before-and-after example with the issue, the raw parser message, and the corrected JSON. That small record helps you compare future Search Console impressions with the exact user problem the page answers. If the page starts receiving impressions but few clicks, update the title and first paragraph before changing the URL. If visitors reach the page but do not use the editor, add a more direct link to JSON Error Finder near the first example.`,
          'When this pattern appears in real work, capture the safest minimal reproduction instead of pasting the full production payload. Remove credentials, customer values, internal hostnames, and identifiers that are not needed to demonstrate the syntax or parsing failure. A focused sample is better for debugging, safer for sharing, and easier for search users to recognize when they have the same JSON problem.',
          'For long-tail SEO, keep the page narrow. Do not turn the article into a generic JSON tutorial. The best improvement is usually another precise example that matches the parser message, the runtime environment, or the HTTP response shape a developer actually sees. This gives the page a clearer reason to rank than broad formatter pages competing for the same head keyword.',
        ],
      }
    }),
  }
}
