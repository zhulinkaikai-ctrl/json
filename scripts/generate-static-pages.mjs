import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { PHASE2_GUIDE_SLUGS, createPhase2Guides } from './phase2-guides.mjs'

export const SITE_URL = 'https://jsonfmt.org'
export const SITE_NAME = 'JSONFmt'
export const CONTACT_EMAIL = 'zhulinkaikai@gmail.com'
const CLOUDFLARE_WEB_ANALYTICS_TOKEN = '1247ce6193f744b0b365cd24ef117245'

const today = '2026-09-04'
const contentUpdatedLabel = 'Updated September 4, 2026'

export const GUIDE_PAGES = [
  guide({
    slug: 'trailing-comma-in-json',
    title: 'Trailing Comma in JSON: Why It Fails and How to Fix It',
    description: 'Learn why trailing commas break strict JSON, how to spot them, and how to fix the error before formatting or validating your data.',
    summary: 'A trailing comma is one of the fastest ways to turn valid-looking JavaScript-style data into invalid JSON.',
    primaryKeyword: 'trailing comma in JSON',
    invalidCode: `{
  "name": "Ada",
  "role": "Engineer",
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('What the error means', [
        'A trailing comma in JSON is a comma that appears after the final property in an object or after the final value in an array. JavaScript allows this style in many places, so developers often paste a JavaScript object literal into a JSON validator and expect it to work. Strict JSON is different. The JSON grammar requires commas only between values, never after the last value.',
        'This article is for developers who already know what the data should look like but need to make it valid JSON quickly. The fix is usually simple: remove the comma that sits immediately before a closing brace or closing bracket.',
      ]),
      section('Why strict JSON rejects it', [
        'JSON is commonly exchanged between services, stored in configuration files, and parsed by tools in many languages. Its strict grammar is one reason it is portable. A parser written in Go, Python, Java, Rust, PHP, or a browser should not have to guess whether the final comma means another value is coming. When the parser sees a comma, it expects another property or array item. If the next character is `}` or `]`, the syntax is invalid.',
        'This is why a trailing comma often produces messages like "Unexpected token }" or "Expected property name". The highlighted location may be the closing brace, but the actual mistake is usually the comma immediately before it.',
      ]),
      section('How to fix it safely', [
        'Scan the line above the highlighted closing brace or bracket. If the last item ends with a comma, delete that comma and validate again. Do not remove commas between real values. In an object, every property except the last one needs a comma after it. In an array, every item except the last item needs a comma after it.',
        'When you use JSONFmt, paste the JSON into the editor and look at the diagnostic panel. If the error is classified as a trailing comma, the panel points to the comma and explains that strict JSON does not allow it after the final item. The tool does not auto-repair your input, so you stay in control of the data.',
      ]),
      section('Common places trailing commas appear', [
        'Trailing commas often come from hand-edited configuration files, copied JavaScript objects, and test fixtures. They also appear when a developer deletes the final property but forgets to remove the comma from the previous line. Arrays have the same problem: `["read", "write",]` is not valid JSON even though it looks harmless.',
        'A good habit is to format valid JSON after each manual edit. If formatting is disabled, the document is still invalid. Fix the syntax first, then format or minify it.',
      ]),
    ],
    faq: [
      ['Are trailing commas valid in JSON?', 'No. Strict JSON does not allow a comma after the final object property or array item.'],
      ['Why does JavaScript allow trailing commas but JSON does not?', 'JavaScript object literals and JSON use similar syntax, but JSON is a stricter data format with a separate grammar.'],
      ['Can a formatter remove trailing commas automatically?', 'Some repair tools can, but JSONFmt V2 shows the problem and lets you decide how to edit the data.'],
    ],
  }),
  guide({
    slug: 'unexpected-token-in-json',
    title: 'Unexpected Token in JSON at Position 0: Causes and Fixes',
    description: 'Fix unexpected token in JSON at position 0 by checking empty responses, HTML error pages, BOM characters, and non-JSON text before calling JSON.parse.',
    summary: 'Unexpected token in JSON at position 0 usually means the parser received an empty body, HTML, a hidden character, or other non-JSON text.',
    searchAnswer: 'At position 0, JSON.parse failed on the first character. Check whether the input is empty, HTML, a BOM-prefixed body, or plain text instead of JSON.',
    fixSteps: [
      'Inspect the raw response body and status before calling response.json().',
      'If the body starts with <, fix the route, redirect, login page, or server error response.',
      'If the body is JSON, validate it and repair the first syntax error before parsing again.',
    ],
    primaryKeyword: 'unexpected token in JSON',
    invalidCode: `{
  "name": "Ada"
  "role": "Engineer"
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('What "unexpected token" means', [
        'Unexpected token in JSON at position 0 usually means the parser received a character or body that is not a complete JSON value. Common causes include an empty response, an HTML page that starts with `<`, a byte-order mark (BOM), or plain text returned where JSON was expected.',
        'This article is for developers debugging copied API responses, log payloads, or configuration data. Instead of guessing, start at the reported line and column, then inspect the line immediately before it. Many unexpected token errors are caused by a missing comma, an extra comma, a missing quote, or a bracket that closes too early.',
      ]),
      section('The token is often only the symptom', [
        'If the parser highlights a property name, the actual mistake may be the previous line. For example, an object property must be separated from the next property by a comma. If the comma is missing after `"name": "Ada"`, the next quote before `"role"` becomes unexpected. The quote is not wrong by itself; it is wrong because the previous value was not closed with a separator.',
        'This is why JSON diagnostics should explain the surrounding context, not only repeat the native parser message. JSONFmt tries to classify common patterns such as missing comma, trailing comma, unquoted key, and bracket mismatch before falling back to a generic syntax error.',
      ]),
      section('How to troubleshoot it', [
        'First, go to the reported line and column. Second, check the character at that location. Third, check the previous meaningful character before it. If two quoted values or two properties appear back to back, add a comma between them. If a closing brace appears right after a comma, remove the comma. If a word appears where a quoted key should be, wrap the key in double quotes.',
        'Avoid large blind edits. Make one syntax change, then validate again. This is especially important with API payloads because one wrong replacement can change the shape of the data.',
      ]),
      section('Prevention tips', [
        'Use strict JSON for files that will be parsed outside JavaScript. Avoid comments, single quotes, and JavaScript-only conveniences. Keep generated JSON generated whenever possible. If you need to hand-edit a payload, paste it into a validator before committing it to a repository or sending it to another service.',
        'When the JSON becomes valid, format it. A formatted document makes the next syntax issue easier to spot because indentation exposes object and array boundaries.',
      ]),
    ],
    relatedGuideSlugs: [
      'unexpected-token-less-than-in-json',
      'empty-response-json-parse-error',
      'json-parse-error',
    ],
    relatedToolSlugs: [
      'json-error-finder',
      'json-validator',
      'fix-invalid-json',
    ],
    faq: [
      ['What is an unexpected token in JSON?', 'It is a character the parser did not expect at that location according to strict JSON syntax.'],
      ['Is the highlighted token always the real mistake?', 'Not always. It is where parsing failed. The real mistake is often just before that position.'],
      ['How do I fix unexpected token errors quickly?', 'Check the highlighted line, then the previous line, for missing commas, extra commas, missing quotes, or mismatched braces.'],
    ],
  }),
  guide({
    slug: 'single-quotes-in-json',
    title: 'Single Quotes in JSON: Can JSON Use Single Quotes?',
    description: 'Fix single quotes in JSON by replacing invalid delimiters with double quotes and checking whether the source is JavaScript, JSON5, or strict JSON.',
    summary: 'Single quotes in JSON are invalid in the strict format. Replace delimiters with double quotes, then validate the complete document.',
    searchAnswer: 'Strict JSON does not allow single quotes around keys or string values. Replace those delimiters with double quotes, then validate the complete document.',
    fixSteps: [
      'Change JSON keys and string delimiters from single quotes to double quotes.',
      'Keep apostrophes inside double-quoted values unless they are syntax delimiters.',
      'Validate again because copied JavaScript objects may also contain comments or trailing commas.',
    ],
    primaryKeyword: 'single quotes in JSON',
    invalidCode: `{
  'name': 'Ada',
  'role': 'Engineer'
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('The short answer', [
        'Single quotes in JSON are invalid string delimiters in the strict format. Property names and string values must be wrapped in double quotes. If you paste `{\'name\': \'Ada\'}` into a strict JSON parser, it fails even though a JavaScript console may accept something similar as an object literal.',
        'This article is for developers who copied data from JavaScript, Python, documentation, or a log and need to turn it into valid JSON. The fix is to replace single quotes around keys and string values with double quotes, while preserving apostrophes inside string values by escaping them only when needed.',
      ]),
      section('JSON is not a JavaScript object literal', [
        'JSON syntax was inspired by JavaScript object notation, but it is a data-interchange format with tighter rules. JavaScript allows object literals with single-quoted strings. JSON does not. The restriction makes parsing simpler and more consistent across programming languages.',
        'A common mistake is to assume that anything accepted by JavaScript is valid JSON. It is not. JSON also rejects comments, functions, undefined, trailing commas, and unquoted property names.',
      ]),
      section('How to fix single-quote errors', [
        'Replace the opening and closing single quote for each JSON key or string value with a double quote. Be careful with apostrophes inside values. For example, `"owner": "Ada API"` is valid because the string uses double quotes around the value. If the value itself contains a double quote, escape it with a backslash.',
        'Do not run a naive find-and-replace on complex data if values contain contractions or apostrophes. Validate after each change or use a trusted conversion step that understands string boundaries.',
      ]),
      section('What JSONFmt reports', [
        'When JSONFmt detects a single quote outside a valid string, it classifies the error as a single-quote issue. The diagnostic panel explains that strict JSON strings must use double quotes and gives a direct repair instruction. The tool does not send your JSON to a server and does not rewrite the input automatically.',
        'After you replace the quotes and the JSON becomes valid, the Format and Minify actions become available. That gives you a second check that the document is truly parseable strict JSON.',
      ]),
    ],
    relatedGuideSlugs: [
      'strict-json-vs-json5',
      'unquoted-property-name-in-json',
      'expected-double-quoted-property-name',
    ],
    relatedToolSlugs: [
      'json-validator',
      'fix-invalid-json',
      'json-error-finder',
    ],
    faq: [
      ['Can JSON use single quotes?', 'No. JSON keys and string values must use double quotes.'],
      ['Why does my browser console accept single quotes?', 'The console may be evaluating a JavaScript object literal, not strict JSON.'],
      ['Should I replace every single quote?', 'Only replace single quotes that delimit JSON keys or string values. Apostrophes inside double-quoted strings can remain.'],
    ],
  }),
  guide({
    slug: 'unquoted-property-name-in-json',
    title: 'Unquoted Property Name in JSON: The Correct Fix',
    description: 'Strict JSON requires object property names to be double-quoted. Learn how to fix unquoted keys safely.',
    summary: 'An unquoted property name is valid in many JavaScript object literals, but it is not valid JSON.',
    primaryKeyword: 'unquoted property name in JSON',
    invalidCode: `{
  name: "Ada",
  role: "Engineer"
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('What the error means', [
        'An unquoted property name means an object key appears as a bare word instead of a double-quoted string. In JSON, every object key must be a string. That means `name: "Ada"` is invalid, while `"name": "Ada"` is valid.',
        'This article is for developers who copied a JavaScript-style object into a JSON tool or API client. The data may look reasonable, but strict JSON parsers reject it because object keys must be quoted consistently.',
      ]),
      section('Why JSON requires quoted keys', [
        'Quoted keys remove ambiguity. A bare word could be a variable name in a programming language, but JSON has no variables. It represents data, not executable expressions. Requiring double-quoted keys makes the format predictable across languages and parsers.',
        'This rule also supports keys that contain spaces, hyphens, dots, or other characters. `"request-id"` and `"user name"` are valid JSON keys. Without quotes, those names would be hard to parse consistently.',
      ]),
      section('How to fix the issue', [
        'Wrap every object property name in double quotes. Do not change string values that are already correctly quoted. After wrapping the key, keep the colon after the closing quote, then ensure commas separate each property.',
        'For example, change `enabled: true` to `"enabled": true`. Change `request-id: "abc"` to `"request-id": "abc"`. If the key contains a double quote, it must be escaped, but that is uncommon in API payloads and configuration files.',
      ]),
      section('How to avoid it next time', [
        'If the source is JavaScript, use `JSON.stringify(value, null, 2)` to export strict JSON instead of copying an object literal manually. If the source is documentation, check whether the example is meant to be JavaScript or JSON. Many docs use JavaScript object notation for readability even when an API expects JSON.',
        'JSONFmt detects common unquoted key patterns and points at the key. After you add quotes, validate again. If the next error is a missing comma or single quote, fix that separately instead of trying to rewrite the whole document at once.',
      ]),
    ],
    faq: [
      ['Do JSON property names need quotes?', 'Yes. Every JSON object property name must be wrapped in double quotes.'],
      ['Are unquoted keys valid in JavaScript?', 'Often yes, but JavaScript object literal syntax is not the same as strict JSON syntax.'],
      ['Can a JSON key contain a hyphen?', 'Yes, as long as the key is quoted, for example `"request-id"`.'],
    ],
  }),
  guide({
    slug: 'unclosed-string-in-json',
    title: 'Unclosed String in JSON: How to Find the Missing Quote',
    description: 'Learn how unclosed strings break JSON parsing, where the missing quote usually is, and how to fix the value safely.',
    summary: 'An unclosed string starts with a double quote but never closes before the parser reaches invalid text or the end of input.',
    primaryKeyword: 'unclosed string in JSON',
    invalidCode: `{
  "message": "Deploy started,
  "status": "running"
}`,
    fixedCode: `{
  "message": "Deploy started",
  "status": "running"
}`,
    sections: [
      section('What an unclosed string is', [
        'A JSON string begins with a double quote and must end with a matching double quote. If the closing quote is missing, the parser keeps reading as if the next characters are still part of the string. Eventually it reaches a line break, another property, or the end of the file and reports a syntax error.',
        'This article is for developers dealing with pasted logs, generated messages, or manually edited API payloads. The fix is usually to add the missing closing quote or escape characters that accidentally broke the string.',
      ]),
      section('Line breaks inside strings', [
        'A literal line break cannot appear inside a JSON string. If a value needs a line break, it must be escaped as `\\n`. This is a frequent source of unclosed string or control character errors. The text looks like a normal multiline message, but strict JSON requires the message to stay on one logical line or use escape sequences.',
        'For example, `"message": "line one\\nline two"` is valid. A real newline between `line one` and `line two` inside the quotes is invalid JSON.',
      ]),
      section('How to find the missing quote', [
        'Start at the highlighted location and move backward to the nearest opening quote. Check whether that string has a closing quote before the comma, brace, or bracket that follows it. If a property name appears in the same color as the previous string in your editor, the previous string probably swallowed it.',
        'Do not simply add a quote at the error location without checking the intended value. You may need to escape a quote inside the value instead. For example, `"message": "User said "ok""` is invalid because the inner quote ends the string early. The fixed form is `"message": "User said \\"ok\\""`. ',
      ]),
      section('Validate after the fix', [
        'After adding the closing quote or escape sequence, validate the JSON again. One string error can hide later errors because the parser loses track of structure. Once the string is fixed, the next issue, if any, will become easier to locate.',
        'JSONFmt highlights the detected line and column and explains the likely missing quote. It keeps the original input unchanged so you can make the repair yourself and preserve the data exactly as intended.',
      ]),
    ],
    faq: [
      ['Can JSON strings span multiple lines?', 'Not with literal line breaks. Use escape sequences such as `\\n` inside the string value.'],
      ['How do I include a quote inside a JSON string?', 'Escape the quote with a backslash, for example `"User said \\"ok\\""`.'],
      ['Why does one missing quote create many errors?', 'Once a string is unclosed, the parser treats later text as part of that string and loses the intended structure.'],
    ],
  }),
  guide({
    slug: 'comments-in-json',
    title: 'Comments in JSON: Why // and /* */ Break Strict JSON',
    description: 'JSON does not support comments. Learn why comment syntax fails and what to use instead in config files and API payloads.',
    summary: 'Comments are useful in code, but strict JSON is a data format and does not allow `//` or block comments.',
    primaryKeyword: 'comments in JSON',
    invalidCode: `{
  // production API endpoint
  "baseUrl": "https://api.example.com"
}`,
    fixedCode: `{
  "baseUrl": "https://api.example.com"
}`,
    sections: [
      section('Are comments valid in JSON?', [
        'No. Strict JSON does not allow line comments with `//` or block comments with `/* ... */`. If a parser sees a slash where it expects a property name or value, it throws a syntax error. Some configuration formats that look like JSON allow comments, but those formats are not strict JSON.',
        'This article is for developers who are moving data between config files, API clients, and validators. If the destination expects JSON, remove comments before sending or storing the data.',
      ]),
      section('Why the rule exists', [
        'JSON was designed as a lightweight data-interchange format. It intentionally avoids programming-language features such as comments, functions, variables, and expressions. That makes it easier for parsers in many languages to agree on exactly what a document means.',
        'Comments can also create problems when JSON is signed, minified, cached, or transmitted between systems. A system receiving the payload expects data only. Extra comment text would need special handling, and strict JSON chooses not to allow that ambiguity.',
      ]),
      section('How to fix JSON with comments', [
        'Remove the comments before validating or sending the JSON. If the note is important, move it into documentation outside the JSON file. For configuration files, consider whether the actual format is JSONC, JSON5, YAML, or another comment-friendly format. Do not assume that an API accepting JSON will accept commented JSON.',
        'If you need a human-readable explanation inside data, use a real property only when the receiving system allows it. For example, `"_comment": "production API endpoint"` is syntactically valid JSON, but it changes the data shape and may be rejected by strict schemas.',
      ]),
      section('How JSONFmt handles comments', [
        'JSONFmt validates strict JSON. When it sees `//` or `/*` outside a string, it reports that comments are not valid in standard JSON. It does not silently strip the comment because that would change the text you pasted. You decide whether to delete the comment, move it elsewhere, or convert the file to a different format.',
        'After comments are removed, validate again and then format the document. Clean formatting makes it easier to review the remaining object and array structure.',
      ]),
    ],
    faq: [
      ['Does JSON support comments?', 'No. Strict JSON does not support line comments or block comments.'],
      ['What is JSONC?', 'JSONC is a JSON-like format with comments, often used by some developer tools. It is not strict JSON.'],
      ['Can I use `_comment` fields?', 'Technically yes, but only if the receiving system allows extra fields. It changes the actual JSON data.'],
    ],
  }),
]

GUIDE_PAGES.push(
  guide({
    slug: 'how-to-format-json',
    title: 'How to Format JSON Online Without Uploading It',
    description: 'Learn how to format JSON online in your browser, make nested data readable, and validate the result before using it in an API or config file.',
    summary: 'Formatting JSON adds clear indentation so you can read, review, and debug nested data without changing its meaning.',
    primaryKeyword: 'how to format JSON',
    invalidCode: `{"service":"billing","enabled":true,"regions":["us-east","eu-west"]}`,
    fixedCode: `{
  "service": "billing",
  "enabled": true,
  "regions": ["us-east", "eu-west"]
}`,
    sections: [
      section('What formatting JSON changes', [
        'Formatting JSON changes whitespace, indentation, and line breaks so the structure is easier to read. It does not change property names, string values, numbers, booleans, arrays, or objects. A formatted payload should parse to exactly the same data structure as its minified version.',
        'This is useful when you receive an API response on one long line, inspect a configuration file, or need to review a JSON fixture in a pull request. Indentation makes object boundaries and array items visible, which reduces the chance of missing a key or reading a nested value in the wrong place.',
      ]),
      section('How to format JSON safely', [
        'Start with strict valid JSON. Paste the text into JSONFmt, wait for the validation result, and use the format action only after the tool reports that the document is valid. If formatting is unavailable, fix the first syntax error shown in the diagnostic panel before trying again.',
        'Do not use formatting as a substitute for validation. An editor can make invalid JSON look neat while it is still missing a comma, using single quotes, or containing a comment. The safe order is validate first, format second, then review the expanded structure.',
      ]),
      section('Choose an indentation style', [
        'Most developer tools use two spaces or four spaces for JSON indentation. The exact width does not change the parsed value, so use the convention of the repository or service where the JSON will live. Consistent indentation matters more than the specific number of spaces.',
        'Avoid tabs when a team or tool requires spaces. Tabs can display at different widths in different editors, which makes deeply nested JSON harder to compare. A browser formatter gives every nested level a predictable shape that works well in diffs and code review.',
      ]),
      section('When formatted JSON reveals a problem', [
        'The formatted shape can reveal semantic surprises after the syntax becomes valid. For example, an object may be nested one level deeper than expected, an array may contain an unexpected item, or a property may have been duplicated in source data. Formatting does not decide whether the data is correct, but it makes those questions easier to answer.',
        'After formatting, compare the visible shape against the API contract, schema, or configuration documentation. When the JSON contains private values, keep the review local and avoid copying the full payload into tickets or shared chat messages.',
      ]),
    ],
    faq: [
      ['Does formatting JSON change the data?', 'No. A formatter changes whitespace and indentation, not the JSON values or structure.'],
      ['Can I format invalid JSON?', 'No. Fix the syntax error first, then format the valid document.'],
      ['Is online JSON formatting private on JSONFmt?', 'Yes. JSONFmt formats and validates the input locally in your browser.'],
    ],
  }),
  guide({
    slug: 'how-to-validate-json',
    title: 'How to Validate JSON and Find Syntax Errors',
    description: 'Learn how to validate JSON, understand parser errors, and fix invalid JSON locally before sending it to an API, tool, or configuration workflow.',
    summary: 'JSON validation checks whether text follows strict JSON syntax before another system tries to parse it.',
    primaryKeyword: 'how to validate JSON',
    invalidCode: `{
  "environment": "production"
  "retries": 3
}`,
    fixedCode: `{
  "environment": "production",
  "retries": 3
}`,
    sections: [
      section('What JSON validation checks', [
        'A JSON validator checks whether a document follows the strict JSON grammar. It verifies that object keys use double quotes, commas appear between values, strings are closed, brackets match, and the text represents one complete JSON value. Validation is about syntax, not whether the values make sense for a specific API.',
        'For example, a validator can confirm that `"retries": 3` is syntactically valid, but it cannot know whether an API expects retries to be three, five, or a string. Use a schema or application contract for semantic rules after the JSON syntax is valid.',
      ]),
      section('How to read a validation error', [
        'Start with the line and column reported by the parser, then inspect the previous meaningful character. A parser often stops where it notices the problem, but the cause may be just before that position. A quote may be unexpected because a comma was missing on the line above, not because the quote itself is wrong.',
        'JSONFmt shows the error location, nearby context, an explanation, and a suggested manual repair for common patterns. Make one small change at a time and validate again. Fixing the first error can expose another error that the parser could not reach earlier.',
      ]),
      section('Validate before formatting or sending', [
        'Validate JSON before using it in an API client, saving it as a configuration file, or committing it to a repository. A request can fail before reaching application logic when the HTTP body is not valid JSON. A configuration file can also break a build or deployment before the service starts.',
        'Once the validator reports success, format the JSON for a structural review or minify it if a compact representation is required. Those transformations are safe only after parsing succeeds, because they operate on the parsed data rather than guessing how to repair invalid text.',
      ]),
      section('Keep validation private', [
        'Validation is often performed on logs and API payloads that may contain credentials, personal data, or internal URLs. Use a browser-local tool and still minimize the data when sharing a reproduction with another person. Replace secrets with placeholders before opening a support issue or sending an example.',
        'A local validator is especially useful for checking a payload before it reaches a third-party service. JSONFmt processes the text in the browser and does not send the contents to a server, account, or history store.',
      ]),
    ],
    faq: [
      ['What does a JSON validator check?', 'It checks strict JSON syntax such as quotes, commas, brackets, strings, and complete document structure.'],
      ['Is valid JSON always valid for my API?', 'No. Syntax validation is separate from API-specific schema and business rules.'],
      ['Why does the parser point at the wrong line?', 'The location is where parsing failed; the original syntax mistake is often immediately before it.'],
    ],
  }),
  guide({
    slug: 'how-to-minify-json',
    title: 'How to Minify JSON Safely for APIs and Config Files',
    description: 'Learn how to minify JSON safely, reduce whitespace without changing data, and validate the compact result before using it in an API or configuration workflow.',
    summary: 'Minifying JSON removes unnecessary whitespace while preserving the exact parsed data structure.',
    primaryKeyword: 'how to minify JSON',
    invalidCode: `{
  "feature": "alerts",
  "channels": [
    "email",
    "webhook"
  ]
}`,
    fixedCode: `{"feature":"alerts","channels":["email","webhook"]}`,
    sections: [
      section('What JSON minification removes', [
        'JSON minification removes spaces, indentation, and line breaks that are not part of a string value. The parser sees the same keys, values, arrays, and objects after minification. The main purpose is to reduce the number of bytes transmitted or stored when the readable layout is not needed.',
        'A minified document is harder for a person to inspect manually, so keep a formatted source version when people need to edit or review the data. Minification is best treated as an output step, not as the primary editing format for configuration files or test fixtures.',
      ]),
      section('Validate before minifying', [
        'A minifier must parse the JSON before it can safely remove whitespace. If the input has a trailing comma, single-quoted string, comment, or unclosed bracket, the tool should stop instead of guessing what the data was meant to be. Fix syntax errors first, then minify the valid document.',
        'JSONFmt keeps the format and minify actions disabled until strict validation succeeds. This makes the operation predictable: a successful minify action means the document was parseable JSON immediately before the transformation.',
      ]),
      section('When minified JSON is useful', [
        'Compact JSON can reduce the size of static fixtures, embedded data, or manually prepared request bodies. It can also be useful when a system has a strict size limit and the data is already known to be valid. The savings come only from whitespace, so large string values and arrays may still dominate the payload size.',
        'For normal API requests, modern HTTP compression often reduces whitespace automatically. Minification can still help in environments where payloads are stored directly, copied into source files, or sent through systems without compression.',
      ]),
      section('Avoid changing string values', [
        'Only whitespace outside JSON strings is safe to remove. A space inside `"display name"` is part of the actual value and must stay. A reliable minifier parses the document instead of using a global replace operation, which could corrupt meaningful spaces, escaped characters, or multiline text represented with escape sequences.',
        'After minifying, validate once more if the compact output is going into another tool. When the output needs to be reviewed by a person later, reformat it instead of trying to read a long single-line document.',
      ]),
    ],
    faq: [
      ['Does minifying JSON change string values?', 'No. A safe minifier removes only whitespace outside strings and preserves the parsed data.'],
      ['Can minified JSON be formatted again?', 'Yes. Valid minified JSON can be formatted back into a readable indented layout.'],
      ['Should I minify a JSON config file?', 'Only when compact size is more important than direct human readability.'],
    ],
  }),
  guide({
    slug: 'json-formatter-vs-validator',
    title: 'JSON Formatter vs Validator: What Each Tool Does',
    description: 'Understand the difference between a JSON formatter and JSON validator, when to use each one, and how formatting, validation, and minification fit together.',
    summary: 'A validator checks strict JSON syntax; a formatter makes already valid JSON easier to read.',
    primaryKeyword: 'json formatter vs validator',
    invalidCode: `{
  'service': 'payments',
  "timeout": 30,
}`,
    fixedCode: `{
  "service": "payments",
  "timeout": 30
}`,
    sections: [
      section('The short difference', [
        'A JSON validator answers a syntax question: can a strict parser read this text as JSON? A JSON formatter answers a presentation question: can this valid JSON be laid out with readable indentation and line breaks? The tools are related, but formatting depends on validation because a formatter needs a parseable document.',
        'When you paste JSON into JSONFmt, validation happens first. If the text is invalid, the diagnostic panel explains the first syntax problem. If it is valid, you can format it for review or minify it for a compact representation.',
      ]),
      section('When to use a validator', [
        'Use a validator when an API client rejects a payload, a configuration file fails to load, a JSON.parse call throws, or copied data looks suspicious. The validator identifies syntax issues such as missing commas, trailing commas, comments, single quotes, unquoted keys, and unmatched brackets.',
        'Validation should happen before any downstream step that assumes JSON is readable. It catches the format-level problem early, close to the text that caused it, instead of making you debug a generic application error later in a request pipeline or deployment log.',
      ]),
      section('When to use a formatter', [
        'Use a formatter after the JSON is valid and you need to inspect the structure. Nested arrays and objects are much easier to reason about when each level has consistent indentation. Formatting also helps reviewers spot unexpected nesting, duplicate-looking fields, or values that appear under the wrong parent object.',
        'Formatting is not an automatic repair tool. If a document is invalid, formatters that claim to repair it may make an assumption about your intended data. JSONFmt keeps the original text in place and shows a manual fix suggestion instead.',
      ]),
      section('Where minification fits', [
        'Minification is the inverse presentation step: it removes nonessential whitespace from valid JSON. Use it after validation when a compact payload is useful. It is not a validator replacement, because a minifier should reject invalid text instead of removing characters blindly.',
        'A practical workflow is validate, format, review, then minify only when the compact output is actually needed. That order gives you readable structure during debugging and a smaller payload at the final handoff.',
      ]),
    ],
    faq: [
      ['Can a formatter validate JSON?', 'A formatter must parse JSON first, but a dedicated validator provides clearer error diagnosis when syntax is invalid.'],
      ['Can a validator format JSON?', 'Some tools include both actions. Validation still happens before formatting can safely run.'],
      ['What is the safest JSON workflow?', 'Validate first, format for review, and minify only when compact output is needed.'],
    ],
  }),
  guide({
    slug: 'unexpected-end-of-json-input',
    title: 'Unexpected End of JSON Input: Causes and Fixes',
    description: 'Learn why unexpected end of JSON input happens, how to find the missing closing quote, brace, or bracket, and how to validate the fixed JSON.',
    summary: 'Unexpected end of JSON input means the parser reached the end before the JSON document was complete.',
    primaryKeyword: 'unexpected end of JSON input',
    invalidCode: `{
  "service": "billing",
  "enabled": true,
  "regions": [
    "us-east",
    "eu-west"
  ]
`,
    fixedCode: `{
  "service": "billing",
  "enabled": true,
  "regions": [
    "us-east",
    "eu-west"
  ]
}`,
    sections: [
      section('What unexpected end of JSON input means', [
        'Unexpected end of JSON input means a strict JSON parser reached the end of the text while it was still waiting for something else. The missing piece is often a closing brace, closing bracket, or closing double quote. The parser cannot finish because the document ends before the current object, array, or string is complete.',
        'This article is for developers who see the error in a browser console, Node.js script, API client, build step, or online validator. Start at the end of the payload, then move backward through the nearest open structure. The fix is usually to restore the missing closing character rather than changing the values themselves.',
      ]),
      section('Common causes in API and log data', [
        'A truncated response is a common cause. An API may return an incomplete body after a timeout, proxy error, failed stream, or copied log entry. If the JSON starts correctly but stops in the middle of an object or array, the source may not have delivered the complete payload.',
        'Manual edits also create this error. A developer may delete the final property and accidentally remove the closing brace, paste only part of a response, or copy a string without its ending quote. Minified one-line JSON makes this harder to spot because the final missing character is visually small.',
      ]),
      section('How to find the missing close', [
        'Look at the last meaningful character in the input. If the document ends after a comma, property name, colon, or open bracket, the JSON is unfinished. Then check whether each opening `{`, `[`, and `"` has a matching closing character. Indentation in a formatted version can help, but you need valid syntax before a formatter can safely run.',
        'In the example above, the array is closed but the outer object is not. Adding the final `}` completes the document. If the error comes from an unclosed string, add the missing quote or escape a quote inside the value with `\\"` if that quote belongs in the string.',
      ]),
      section('Validate the whole document after repair', [
        'Do not validate only the last line after making the repair. The missing closing character may have hidden another syntax problem earlier in the document. Paste the full payload into JSONFmt, run validation, and then format the result once the syntax passes.',
        'If the same error keeps returning from an API response, check the raw HTTP status, response body, and content type. The fix may be in the producer that generated or transported the JSON, not in the consumer that tried to parse it.',
      ]),
      section('Prevent the error in generated JSON', [
        'When JSON is created by application code, prefer a serializer over string concatenation. A serializer keeps braces, brackets, quotes, and escape sequences balanced even when optional fields are added or removed. That reduces the chance that a generated payload ends halfway through a structure.',
        'For files that people edit manually, keep the formatted version in source control and validate it in tests or CI. A complete formatted file makes the final closing character visible during review, while automated validation catches accidental truncation before the file reaches production.',
      ]),
    ],
    faq: [
      ['What causes unexpected end of JSON input?', 'It usually means the JSON ended before an object, array, or string was closed. Truncated responses and incomplete manual copies are common causes.'],
      ['How do I fix unexpected end of JSON input?', 'Check the end of the payload and add the missing closing brace, bracket, or quote that completes the open structure.'],
      ['Can a formatter fix this error automatically?', 'A formatter needs valid JSON first. Fix the incomplete syntax, validate again, then format the repaired document.'],
    ],
  }),
  guide({
    slug: 'bad-control-character-in-json',
    title: 'Bad Control Character in JSON: What It Means',
    description: 'Fix bad control character in JSON errors by finding raw line breaks, tabs, or unescaped characters inside string values.',
    summary: 'A bad control character in JSON usually means a raw newline, tab, or other unescaped control character appears inside a string.',
    primaryKeyword: 'bad control character in JSON',
    invalidCode: `{
  "message": "First line
Second line",
  "status": "open"
}`,
    fixedCode: `{
  "message": "First line\\nSecond line",
  "status": "open"
}`,
    sections: [
      section('What bad control character in JSON means', [
        'Bad control character in JSON means the parser found a character that cannot appear literally at that position. The most common case is a real line break inside a quoted string. JSON strings can represent a line break, but they must use an escape sequence such as `\\n` instead of an actual newline inside the quotes.',
        'This article is for developers copying logs, messages, stack traces, or text fields into JSON. The data may look readable in an editor, but strict JSON requires control characters inside strings to be escaped so parsers in different languages interpret the value consistently.',
      ]),
      section('Where control characters appear', [
        'Control character errors often come from multiline text, pasted tabs, carriage returns, and generated strings that were not passed through a JSON serializer. A raw newline inside `"message": "..."` breaks JSON because the string boundary is no longer represented in a portable way.',
        'Tabs inside strings have the same problem when they are literal tab characters. Use `\\t` when the value needs a tab and `\\r\\n` or `\\n` when the value needs a line break. Whitespace outside strings can remain normal indentation and line breaks.',
      ]),
      section('How to fix the string safely', [
        'First, locate the quoted string mentioned near the error. If the string spans multiple visible lines, replace the actual line break with `\\n`. If it contains a literal tab, replace that tab with `\\t`. Do not remove meaningful spaces inside the value unless the receiving system truly does not need them.',
        'Use a real JSON serializer when the content is generated by code. For example, `JSON.stringify` in JavaScript escapes control characters for you. Manual escaping is useful for small repairs, but generated logs and messages should be serialized before they are sent or stored as JSON safely and consistently.',
      ]),
      section('Check the parsed value after validation', [
        'After replacing raw control characters with escape sequences, validate the whole JSON document. Then inspect how the receiving application reads the value. The escape sequence `\\n` represents a line break in the parsed string; it is not meant to display as backslash and n unless another layer treats it as plain text.',
        'If the input came from an API response, check whether the producer is building JSON through string concatenation. That pattern often causes escaping mistakes. A serializer-backed output step is safer because it handles quotes, backslashes, and control characters consistently.',
      ]),
      section('Common replacements to check', [
        'Use `\\n` for a newline, `\\t` for a tab, `\\r` for a carriage return, and `\\"` for a double quote that belongs inside the string value. A literal backslash also needs care because it starts an escape sequence; use `\\\\` when the parsed value should contain one backslash.',
        'These replacements should happen only inside string values. Whitespace between properties, array items, braces, and brackets is normal JSON formatting and does not need to be escaped. If you are unsure where the string starts, validate a smaller redacted sample first so the repair does not change unrelated production data.',
      ]),
    ],
    faq: [
      ['What is a bad control character in JSON?', 'It is an unescaped control character, such as a raw newline or tab, in a place where strict JSON syntax does not allow it.'],
      ['How do I put a line break in a JSON string?', 'Use the escape sequence `\\n` inside the string instead of a literal line break.'],
      ['Can indentation cause this error?', 'Normal indentation outside strings is fine. The error usually happens when control characters appear inside quoted string values.'],
    ],
  }),
  guide({
    slug: 'missing-comma-in-json',
    title: 'Missing Comma in JSON: How to Spot the Error',
    description: 'Learn how missing comma in JSON errors happen, why parsers often point at the next key, and how to fix object and array separators.',
    summary: 'A missing comma in JSON usually appears between two object properties or array values that should be separated.',
    primaryKeyword: 'missing comma in JSON',
    invalidCode: `{
  "name": "Ada"
  "role": "Engineer",
  "active": true
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer",
  "active": true
}`,
    sections: [
      section('What missing comma in JSON means', [
        'Missing comma in JSON means two values appear next to each other without the separator strict JSON requires. In an object, each property after the first must be separated from the previous property by a comma. In an array, each item after the first must also be separated by a comma.',
        'This article is for developers who see an unexpected token near a property name, quote, number, or bracket. The highlighted character is often the next valid-looking value. The real mistake is usually just before it, where the previous value ended without a comma.',
      ]),
      section('Why the parser points at the next key', [
        'In the example above, `"name": "Ada"` is valid by itself. The parser then sees `"role"` immediately after the string value. Because a JSON object needs a comma between properties, the quote before `role` becomes unexpected. The parser reports where it became confused, not always where the comma should be inserted.',
        'This is why missing comma errors are easier to find when the document is formatted. Each property sits on its own line, so you can check whether the previous line ended with a comma unless it is the final property in that object.',
      ]),
      section('How to fix object and array separators', [
        'Add a comma after the previous complete value, not before the next key. For object properties, the comma goes after the value and before the next property name. For arrays, the comma goes after the previous item and before the next item.',
        'Do not add a comma after the final property or final array item. That creates a different error: a trailing comma. A useful rule is simple: commas go between values, not before the first value and not after the last value.',
      ]),
      section('Use formatting after validation passes', [
        'After adding the missing comma, validate the full document again. If another property was also missing a separator, the parser may now be able to reach that later location. Continue one repair at a time until validation passes.',
        'Once the JSON is valid, format it. The formatted layout creates a visual checklist for future edits, especially in configuration files and test fixtures where missing commas often appear after manual changes.',
      ]),
      section('Common places the separator is missed', [
        'Missing commas often appear after manually moving object properties, copying only part of an example, or deleting a field from the middle of a configuration file. They also happen in arrays when one value is added after another without the separator, such as `["read" "write"]` instead of `["read", "write"]`.',
        'If the payload is generated by code, do not patch commas with string concatenation. Build an object or array in the programming language and serialize it as JSON. That keeps separators correct even when optional fields are present, absent, or reordered.',
      ]),
    ],
    faq: [
      ['Where do commas go in JSON?', 'Commas go between object properties and between array items. They do not go before the first item or after the final item.'],
      ['Why does a missing comma show as unexpected token?', 'The parser often notices the problem only when it reaches the next key or value that should have been separated by a comma.'],
      ['Can a JSON formatter add missing commas?', 'A formatter requires valid JSON first. Add the missing comma, validate, and then format the corrected document.'],
    ],
  }),
  guide({
    slug: 'expected-double-quoted-property-name',
    title: 'Expected Double-Quoted Property Name in JSON',
    description: 'Fix expected double-quoted property name JSON errors by quoting object keys, removing trailing commas, and validating strict JSON syntax.',
    summary: 'Expected double-quoted property name usually means a JSON object key is unquoted, single-quoted, or missing after a comma.',
    primaryKeyword: 'expected double-quoted property name',
    invalidCode: `{
  name: "Ada",
  "role": "Engineer"
}`,
    fixedCode: `{
  "name": "Ada",
  "role": "Engineer"
}`,
    sections: [
      section('What expected double-quoted property name means', [
        'Expected double-quoted property name means the parser is inside a JSON object and is waiting for the next key to start with a double quote. In strict JSON, every object property name must be a string wrapped in double quotes. A bare word like `name`, a single-quoted key like `\'name\'`, or a closing brace after a trailing comma can all trigger this kind of message.',
        'This article is for developers who copied a JavaScript object, edited a configuration file, or pasted an API example that looks close to JSON but fails in a strict parser. The fastest fix is to check the object member at the reported line and the comma immediately before it.',
      ]),
      section('Why object keys must be quoted', [
        'JSON has no variables, identifiers, or object-literal shortcuts. It is a data format, so object keys are always strings. Requiring double quotes keeps parsing consistent across JavaScript, Python, Go, Java, PHP, command-line tools, API gateways, and configuration loaders.',
        'Quoted keys also allow names that contain hyphens, dots, spaces, or other punctuation. `"request-id"`, `"user.name"`, and `"content type"` are all valid JSON keys because the quotes make the key boundary explicit.',
      ]),
      section('How to fix the error safely', [
        'If the key is unquoted, wrap it in double quotes and keep the colon after the closing quote. Change `enabled: true` to `"enabled": true`. If the key uses single quotes, replace only the outer key quotes with double quotes. Do not blindly replace every apostrophe in the document because apostrophes can be part of real string values.',
        'If the parser points at a closing brace, check whether the previous property ends with an extra comma. After a comma, the parser expects another double-quoted property name. If the object is finished, remove the comma instead of adding a fake key.',
      ]),
      section('Validate the complete object again', [
        'After quoting the key or removing the extra comma, validate the full object. A copied JavaScript object may contain several JSON-incompatible patterns, including comments, single-quoted strings, trailing commas, `undefined`, or functions. Fix one syntax issue at a time so you do not accidentally change the intended data.',
        'When validation succeeds, format the JSON and inspect the object shape. This confirms that the key belongs to the expected object and was not accidentally nested under the wrong parent during manual repair.',
      ]),
      section('When the message appears after a comma', [
        'This error is not always caused by an unquoted key. If a comma appears before the reported location, the parser expects another property name. When the next character is `}`, the object is finished but the comma incorrectly says another key is coming. Remove the comma instead of inventing a new property.',
        'This distinction matters because the repair changes the data differently. Quoting a real key preserves a property that should exist. Removing a trailing comma preserves the existing properties and simply fixes the separator. Check the surrounding object before deciding which repair is correct.',
      ]),
    ],
    faq: [
      ['What does expected double-quoted property name mean?', 'It means the parser expected the next JSON object key to begin with a double quote, but found something else.'],
      ['Can JSON object keys be unquoted?', 'No. Strict JSON requires every object key to be wrapped in double quotes.'],
      ['Can a trailing comma cause this error?', 'Yes. After a comma, the parser expects another quoted property name. If the object is complete, remove the trailing comma.'],
    ],
  }),
  guide({
    slug: 'json-parse-error',
    title: 'JSON Parse Error: How to Diagnose Invalid JSON',
    description: 'Understand JSON parse error messages, find the first syntax issue, and repair invalid JSON with line, column, and context checks.',
    summary: 'A JSON parse error means a parser could not read the text as one complete strict JSON value.',
    searchAnswer: 'A JSON parse error means the parser received text that is not one complete strict JSON value. Check the reported location, the previous character, and whether the input is really JSON.',
    fixSteps: [
      'Check the reported line and column, then inspect the previous meaningful character.',
      'Look for missing commas, extra commas, missing quotes, comments, unquoted keys, or incomplete brackets.',
      'If the input came from an API, inspect the raw body, status, and content type before editing it.',
    ],
    relatedGuideSlugs: [
      'unexpected-token-in-json',
      'unexpected-token-less-than-in-json',
      'unexpected-end-of-json-input',
    ],
    relatedToolSlugs: [
      'json-error-finder',
      'json-validator',
      'fix-invalid-json',
    ],
    primaryKeyword: 'JSON parse error',
    invalidCode: `{
  "status": "ok",
  "count": 3,
}`,
    fixedCode: `{
  "status": "ok",
  "count": 3
}`,
    sections: [
      section('What a JSON parse error means', [
        'A JSON parse error means the parser reached text that does not match strict JSON syntax. The problem might be a missing comma, trailing comma, unclosed string, single quote, comment, unquoted key, raw control character, or incomplete document. The exact native message depends on the parser and programming language.',
        'This article is for developers who see parse failures in `JSON.parse`, API clients, browser consoles, CI jobs, configuration loaders, or backend logs. Treat the message as a clue, then inspect the reported line, column, and surrounding text before changing the payload.',
      ]),
      section('Read the location as a starting point', [
        'The reported line and column show where the parser stopped, not always where the original mistake began. If the parser highlights a quote before a property name, the missing comma may belong on the previous line. If it highlights a closing brace, an extra comma may appear just before that brace.',
        'Start at the highlighted character, then check the previous meaningful character. This two-step habit solves many parser messages faster than searching the whole document from the top.',
      ]),
      section('Check whether the input is really JSON', [
        'Sometimes the text is not JSON at all. A response beginning with `<` may be an HTML error page. A response that starts with a bare word may be plain text. A JavaScript object literal may contain single quotes, comments, or unquoted keys that a strict JSON parser will reject.',
        'Before repairing syntax, confirm that the source should actually be strict JSON. If the API returned HTML, fix the request, authentication, route, or server error instead of editing the HTML as if it were a malformed JSON object.',
      ]),
      section('Use a repeatable repair workflow', [
        'Make one small syntax repair, validate again, and repeat. A JSON parse error can hide later issues because the parser cannot reliably inspect text after the first blocking failure. Broad find-and-replace changes can also corrupt string values, so avoid them unless a serializer or parser-aware tool is doing the conversion.',
        'After validation passes, format the document and compare the visible structure with the expected schema or API contract. Syntax success means the JSON can be parsed; it does not prove that the values are correct for the receiving system.',
      ]),
      section('Debug parser errors from code', [
        'When the error happens in application code, log or inspect the raw text before parsing it. Do not log secrets, but confirm whether the body is empty, truncated, HTML, JavaScript-style data, or a valid JSON string that is being parsed twice. Many JSON parse error reports are caused by the wrong input reaching the parser.',
        'Also check whether the response was already parsed by a framework or SDK. Passing an object into `JSON.parse` after it has already become an object can create confusing errors. Know whether each layer is handling text, a parsed value, or a serialized string.',
      ]),
    ],
    faq: [
      ['What causes a JSON parse error?', 'Common causes include missing commas, trailing commas, single quotes, comments, unquoted keys, unclosed strings, and incomplete documents.'],
      ['Why does JSON.parse fail on valid-looking text?', 'The text may be JavaScript-style data, HTML, or plain text rather than strict JSON.'],
      ['How do I fix a JSON parse error quickly?', 'Check the reported line and column, then inspect the previous meaningful character for the syntax issue that caused parsing to stop.'],
    ],
  }),
  guide({
    slug: 'unexpected-token-less-than-in-json',
    title: 'Unexpected Token < in JSON: API Returned HTML',
    description: 'Fix unexpected token < in JSON errors by checking whether an API returned HTML instead of JSON, then validating the real response body.',
    summary: 'Unexpected token < in JSON usually means the parser received HTML from a login page, redirect, or error route.',
    primaryKeyword: 'unexpected token < in JSON',
    invalidCode: `<!doctype html>
<html>
  <body>Not Found</body>
</html>`,
    fixedCode: `{
  "error": "Not Found",
  "status": 404
}`,
    sections: [
      section('What unexpected token < in JSON means', [
        'Unexpected token < in JSON usually means a parser expected a JSON value but found the opening character of HTML. This often happens when application code calls `response.json()` on a response body that is actually an error page, login page, redirect page, or static HTML document.',
        'This article is for developers debugging frontend fetch calls, API routes, reverse proxies, and server responses. The fix is usually not to edit the `<` character. The fix is to find why the endpoint returned HTML when the client expected JSON.',
      ]),
      section('Check the raw response first', [
        'Before changing parsing code, inspect the raw response body and HTTP status. A `404` route may return an HTML not-found page. A `500` server error may return a framework error screen. An expired session may return a login document. All of those bodies start with HTML even though your client code expects JSON.',
        'Also check the `Content-Type` header. A JSON API should usually return `application/json`. If the content type is `text/html`, the parser error is only a symptom of the wrong response format.',
      ]),
      section('Common causes in frontend apps', [
        'The request URL may be misspelled, missing a base path, or pointing at the frontend app instead of the API server. In local development, proxy configuration can also send `/api/...` requests to the wrong place. When the route misses, the server returns the app HTML shell, and `response.json()` fails on the first `<`.',
        'Authentication and redirects are another common cause. A browser may follow a redirect to a login page, then your code tries to parse that login page as JSON. Check the final URL, response status, and response body before assuming the JSON parser is broken.',
      ]),
      section('Return a real JSON error body', [
        'If you control the API, return JSON for error cases too. For example, send `{"error":"Not Found","status":404}` with the correct status and content type instead of an HTML page when the client is an API consumer. Consistent response shapes make client error handling much easier.',
        'If you do not control the API, add client checks before parsing. Confirm the status and content type, then read text for debugging when the response is not JSON. After you have the real JSON body, paste it into JSONFmt to validate and format it locally.',
      ]),
      section('Prevent the client from parsing blindly', [
        'A defensive client checks the response before assuming JSON. Inspect `response.ok`, the status code, and the content type. If the response is not JSON, read it as text and show a helpful diagnostic instead of sending it directly into a JSON parser.',
        'This does not replace server-side fixes, but it makes failures easier to understand. A clear message such as "API returned HTML 404 page" gives you a better next step than a generic parser error that only mentions the first `<` character.',
      ]),
    ],
    faq: [
      ['Why does unexpected token < happen in JSON?', 'It usually happens because the response starts with HTML, not JSON. The `<` is often the first character of an HTML document.'],
      ['Is unexpected token < a JSON syntax problem?', 'The parser error is real, but the root cause is often the wrong response body or endpoint rather than a JSON typo.'],
      ['How do I debug unexpected token < in fetch?', 'Check the raw response text, status code, final URL, and content type before calling `response.json()`.'],
    ],
  }),
  guide({
    slug: 'strict-json-vs-json5',
    title: 'Strict JSON vs JSON5: Which Syntax Are You Using?',
    description: 'Compare strict JSON vs JSON5 syntax, including comments, trailing commas, single quotes, unquoted keys, and parser compatibility.',
    summary: 'Strict JSON is the portable data format most APIs expect; JSON5 is a more relaxed JSON-like format for specific tools.',
    primaryKeyword: 'strict JSON vs JSON5',
    invalidCode: `{
  // JSON5-style example
  name: 'Ada',
  enabled: true,
}`,
    fixedCode: `{
  "name": "Ada",
  "enabled": true
}`,
    sections: [
      section('The short difference', [
        'Strict JSON vs JSON5 is a compatibility choice. Strict JSON requires double-quoted keys and strings, rejects comments, and does not allow trailing commas. JSON5 is a JSON-like format that permits some JavaScript-style conveniences, but it is not accepted by every JSON parser or API.',
        'This article is for developers who copied config or documentation into a JSON validator and saw errors for comments, single quotes, or unquoted keys. The text may be valid JSON5, but that does not make it valid strict JSON.',
      ]),
      section('Why APIs usually expect strict JSON', [
        'Strict JSON is widely supported across languages and infrastructure. API gateways, SDKs, databases, CLIs, and config loaders can parse it without agreeing on optional extensions. That portability is the main reason public APIs usually document request and response bodies as strict JSON.',
        'JSON5 can be useful in tools that explicitly support it, especially hand-edited configuration. The risk appears when a relaxed example is sent to a strict parser. A server that expects JSON will not automatically understand comments, single-quoted strings, or unquoted keys.',
      ]),
      section('Syntax differences that cause errors', [
        'The most common differences are comments, trailing commas, single quotes, and unquoted property names. JSON5 may allow these patterns, while strict JSON rejects them. Strict JSON also does not support values such as `undefined`, functions, or expressions because it represents data only.',
        'If a validator flags multiple issues at once, convert the document step by step. Remove comments, quote keys with double quotes, replace single-quoted strings, remove trailing commas, and validate again after each change.',
      ]),
      section('Choose the format at the boundary', [
        'Use JSON5 only when the tool consuming the file explicitly documents JSON5 support. Use strict JSON for API payloads, public examples, generated responses, and files that move between different languages or services.',
        'When in doubt, convert to strict JSON before sending or sharing the payload. JSONFmt validates strict JSON, so it is useful as a final compatibility check before the document crosses an API, build, or documentation boundary.',
      ]),
      section('Convert JSON5-style snippets carefully', [
        'A safe conversion is more than removing comments. Quote every object key, change single-quoted strings to double-quoted strings, remove trailing commas, and replace unsupported values with valid JSON values. For example, `undefined` has no strict JSON equivalent, so you may need to remove the property or use `null` if that matches the consuming system.',
        'Validate after each conversion step when the payload matters. Relaxed syntax can hide several issues at once, and a broad replacement can damage apostrophes, quotes, or backslashes inside real string values.',
      ]),
    ],
    faq: [
      ['Is JSON5 the same as JSON?', 'No. JSON5 is a relaxed JSON-like syntax, while strict JSON follows the standard syntax most APIs expect.'],
      ['Can strict JSON contain comments?', 'No. Comments are not valid in strict JSON.'],
      ['Should API examples use JSON5?', 'Usually no. Public API examples should use strict JSON so they work across languages and clients.'],
    ],
  }),
  guide({
    slug: 'is-online-json-formatter-safe',
    title: 'Is an Online JSON Formatter Safe for Private Data?',
    description: 'Learn when an online JSON formatter is safe, what browser-local processing means, and how to avoid exposing private API payloads.',
    summary: 'An online JSON formatter is safer when formatting happens locally in your browser and the tool does not upload your JSON.',
    primaryKeyword: 'is online JSON formatter safe',
    invalidCode: `{
  "token": "paste-redacted-values-only",
  "customerEmail": "user@example.com"
}`,
    fixedCode: `{
  "token": "REDACTED",
  "customerEmail": "user@example.com"
}`,
    sections: [
      section('The short answer', [
        'Is online JSON formatter safe for private data? It depends on how the tool processes the input. A browser-local formatter is safer because the JSON is parsed and formatted on your device instead of being sent to a server. A server-side formatter can expose API payloads, tokens, customer data, logs, or internal URLs if it uploads the text for processing.',
        'This article is for developers, support engineers, and product teams who need to inspect JSON without leaking sensitive values. Even with a local tool, the safest habit is to redact secrets before sharing screenshots, examples, tickets, or chat messages.',
      ]),
      section('What browser-local processing means', [
        'Browser-local processing means the parsing, validation, formatting, and minification logic runs inside the page already loaded in your browser. The tool does not need to send the JSON body to an external parsing service to produce the result. JSONFmt is designed around that model.',
        'Analytics should also avoid capturing the JSON itself. Page views, route names, and generic usage events are different from payload content. A privacy-first JSON tool should not place pasted JSON into analytics events, URLs, logs, accounts, or shared histories.',
      ]),
      section('What still requires caution', [
        'Local processing does not remove every responsibility. Browser extensions, shared computers, screenshots, clipboard history, and team communication can still expose data. If a payload contains credentials, personal data, financial information, private endpoints, or production identifiers, reduce it before showing it to anyone else.',
        'Do not paste secrets into a public issue, support ticket, or documentation example. Replace tokens with `REDACTED`, simplify nested objects, and keep only the fields needed to reproduce the syntax issue.',
      ]),
      section('A safe JSON formatting checklist', [
        'Before formatting sensitive JSON, ask whether the full payload is necessary. If you only need to fix syntax, create a minimal sample with the same structural problem. If you need to inspect a production response, keep it in a local browser session and avoid copying the full output into cloud notes or chats.',
        'After formatting, clear the editor if another person will use the same device. Keep private values out of URLs because URLs can enter browser history, server logs, and analytics. JSONFmt does not use URL-prefilled private JSON for that reason.',
      ]),
      section('How to evaluate a JSON tool before pasting data', [
        'Look for a clear privacy policy, contact page, and explanation of whether processing happens in the browser or on a server. Be cautious with tools that require account uploads, store history, or encourage sharing a URL that contains the JSON payload.',
        'For sensitive work, prefer a small redacted sample that reproduces the structure or syntax issue. If the original payload contains credentials, customer records, internal hostnames, or production identifiers, remove those values before using any public web page or asking another person for help.',
      ]),
    ],
    faq: [
      ['Is JSONFmt safe for private JSON?', 'JSONFmt processes JSON locally in your browser and does not upload the input for parsing, formatting, or validation.'],
      ['Should I paste API tokens into any online tool?', 'Avoid pasting real tokens when possible. Redact secrets before sharing examples or screenshots.'],
      ['Can analytics see my pasted JSON?', 'JSONFmt analytics should measure page usage only, not pasted JSON content or generated output.'],
    ],
  }),
)

GUIDE_PAGES.push(...createPhase2Guides(guide, section))

export const PRIORITY_GUIDE_SLUGS = [
  'unexpected-token-in-json',
  'json-parse-error',
  'single-quotes-in-json',
  'unexpected-non-whitespace-character-after-json',
  'response-json-is-not-a-function',
]

export const TOOL_PAGES = [
  tool({
    slug: 'json-formatter',
    title: 'JSON Formatter Online - Format JSON Locally',
    description: 'Use a JSON formatter online in your browser. Make valid JSON readable with clean indentation without uploading or storing your data.',
    heading: 'JSON formatter',
    summary: 'Use this JSON formatter to paste valid JSON, create a readable structure, and keep the entire workflow in your browser.',
    primaryKeyword: 'json formatter',
    action: 'Format JSON',
    relatedGuideSlugs: [
      'how-to-format-json',
      'json-formatter-vs-validator',
      'trailing-comma-in-json',
    ],
    sections: [
      section('Format JSON without leaving your browser', [
        'JSONFmt formats strict valid JSON locally so you can inspect nested objects and arrays without uploading API payloads, configuration files, or logs.',
        'Use the formatter after validation succeeds to turn a compact response into an indented document that is easier to review and copy.',
      ]),
      section('When formatting helps most', [
        'Formatting is useful for API responses, test fixtures, configuration files, and copied request bodies that arrive on one long line.',
        'It changes presentation only. Keys, values, arrays, and object structure remain the same after formatting.',
      ]),
      section('Use the formatted output for review', [
        'A JSON formatter is most useful after the syntax is already valid. Format the payload, scan the indentation, and check whether nested objects or arrays sit where you expected.',
        'If the formatted shape looks wrong, validate the source again and compare it with the API contract or configuration documentation before copying the output into another system.',
      ]),
    ],
    faq: [
      ['Is this JSON formatter private?', 'Yes. JSONFmt processes JSON locally in your browser and does not upload it.'],
      ['Can I format invalid JSON?', 'Fix the reported syntax issue first, then format the valid JSON.'],
      ['Does formatting change JSON values?', 'No. It changes whitespace and indentation only.'],
      ['When should I use a JSON formatter?', 'Use it when valid JSON is compact, nested, or difficult to review on one line.'],
    ],
  }),
  tool({
    slug: 'json-validator',
    title: 'JSON Validator Online - Check JSON Syntax Locally',
    description: 'Use a JSON validator online in your browser. Find strict JSON syntax errors with line, column, and fix guidance without uploading your data.',
    heading: 'JSON validator',
    summary: 'Use this JSON validator to check whether JSON is valid, locate the first syntax error, and get a clear explanation before sending data anywhere.',
    primaryKeyword: 'json validator',
    action: 'Validate JSON',
    relatedGuideSlugs: [
      'json-parse-error',
      'unexpected-token-in-json',
      'expected-double-quoted-property-name',
      'single-quotes-in-json',
    ],
    sections: [
      section('Check strict JSON syntax', [
        'JSONFmt validates standard JSON syntax and flags common issues such as missing commas, trailing commas, comments, single quotes, and unclosed strings.',
        'The diagnostic panel identifies the line and column where parsing stopped, then explains the likely correction in plain language.',
      ]),
      section('Validate before the next system does', [
        'Run validation before pasting a payload into an API client, committing a JSON config file, or passing text into JSON.parse.',
        'Syntax validation confirms the document can be parsed; schema and application rules should be checked separately when they apply.',
      ]),
      section('Separate syntax from schema rules', [
        'A JSON validator confirms that the text follows strict JSON syntax. It does not decide whether an API expects a field, whether a number is in range, or whether a value matches your business rules.',
        'After the syntax passes, use your API schema, tests, or application validation to check the meaning of the data.',
      ]),
    ],
    faq: [
      ['What does a JSON validator check?', 'It checks strict JSON syntax, including quotes, commas, strings, brackets, and full document structure.'],
      ['Does JSONFmt validate JSON5?', 'No. JSONFmt validates strict standard JSON only.'],
      ['Is JSON input stored?', 'No. The browser processes the input locally.'],
      ['Can valid JSON still fail an API?', 'Yes. Valid JSON can still fail schema, authentication, content-type, or application-specific checks.'],
    ],
  }),
  tool({
    slug: 'json-minifier',
    title: 'JSON Minifier Online - Minify JSON Locally',
    description: 'Use a JSON minifier online in your browser. Remove unnecessary whitespace without changing the data or uploading your JSON.',
    heading: 'JSON minifier',
    summary: 'Use this JSON minifier to compact valid JSON by removing indentation and unnecessary whitespace while preserving the exact parsed data.',
    primaryKeyword: 'json minifier',
    action: 'Minify JSON',
    relatedGuideSlugs: [
      'how-to-minify-json',
      'unexpected-end-of-json-input',
      'json-formatter-vs-validator',
    ],
    sections: [
      section('Make valid JSON compact', [
        'JSONFmt minifies parseable JSON by removing whitespace outside string values. The output represents the same keys, values, arrays, and objects.',
        'Use minification for compact fixtures, embedded data, or request bodies when readability is no longer the priority.',
      ]),
      section('Validation comes first', [
        'Invalid JSON cannot be safely minified because the parser cannot identify which spaces or characters belong to the data structure.',
        'Fix the first syntax issue, validate again, then use the minify action to create a compact local result.',
      ]),
      section('Keep a readable source when people edit it', [
        'A JSON minifier is best used at the final output boundary. Keep a formatted source for code review, documentation, or configuration work when humans will need to make changes later.',
        'If the compact output is copied into another tool, validate it once more after the copy step so whitespace removal did not hide a transfer mistake.',
      ]),
    ],
    faq: [
      ['Does minifying JSON remove spaces inside strings?', 'No. A safe minifier preserves every string value exactly.'],
      ['Can I format minified JSON again?', 'Yes. Any valid minified JSON can be formatted into a readable layout.'],
      ['Is the minifier browser-local?', 'Yes. JSONFmt does not upload the JSON you minify.'],
      ['When should I minify JSON?', 'Minify JSON when compact size matters more than direct human readability.'],
    ],
  }),
  tool({
    slug: 'json-beautifier',
    title: 'JSON Beautifier Online - Beautify JSON Locally',
    description: 'Use a JSON beautifier online with readable indentation and local browser processing. Clean up valid JSON without uploads.',
    heading: 'JSON beautifier',
    summary: 'Use this JSON beautifier to turn valid JSON into a clean, readable layout for debugging, review, and configuration work.',
    primaryKeyword: 'json beautifier',
    action: 'Beautify JSON',
    sections: [
      section('Beautify JSON for inspection', [
        'JSON beautification is another name for formatting JSON with consistent line breaks and indentation.',
        'The readable layout helps developers trace nested objects, arrays, and configuration values without altering the data itself.',
      ]),
      section('Use a parser-backed beautifier', [
        'A parser-backed tool works from the actual JSON structure, so it will stop and report syntax problems rather than rearranging invalid text.',
        'JSONFmt keeps your input local and provides a direct error explanation when the content needs repair before beautification.',
      ]),
      section('Beautify after fixing syntax errors', [
        'A JSON beautifier should not guess how invalid text was meant to look. It should parse the document first, then produce clean indentation from the actual object or array structure.',
        'If the parser reports an error, repair the first syntax issue and run beautify again after the JSON becomes valid.',
      ]),
    ],
    faq: [
      ['Is JSON beautifier different from JSON formatter?', 'They describe the same core task: making valid JSON readable with indentation.'],
      ['Can a beautifier repair invalid JSON?', 'JSONFmt explains the syntax issue and lets you repair it manually first.'],
      ['Does beautifying JSON change the object structure?', 'No. It changes only the visible whitespace.'],
      ['Why use a JSON beautifier?', 'Use it when copied JSON is valid but too dense to inspect, compare, or share in a readable way.'],
    ],
  }),
  tool({
    slug: 'json-pretty-print',
    title: 'JSON Pretty Print Online - Readable JSON Locally',
    description: 'Use JSON pretty print online in your browser. Turn valid compact JSON into an indented, readable document without uploading it.',
    heading: 'JSON pretty print',
    summary: 'Use JSON pretty print to turn valid JSON into an organized layout that is easier to scan, debug, and review.',
    primaryKeyword: 'json pretty print',
    action: 'Pretty print JSON',
    sections: [
      section('Turn compact JSON into readable JSON', [
        'Pretty printing expands a one-line or densely packed JSON document into an indented structure with clear object and array boundaries.',
        'It is especially useful when an API response, log entry, or environment value is difficult to understand in compact form.',
      ]),
      section('Keep the data intact', [
        'Pretty printing changes whitespace around the JSON structure but leaves values and property names intact.',
        'JSONFmt validates first, so you do not receive a polished-looking document that still fails a strict JSON parser.',
      ]),
      section('Read nested data faster', [
        'JSON pretty print output makes each object level and array item visible. That helps when you need to find one nested field in a large API response or explain a payload during a review.',
        'Copy the pretty printed output when readability matters, or use the minifier when the next step needs a compact single-line result.',
      ]),
    ],
    faq: [
      ['What is JSON pretty print?', 'It is formatting valid JSON with indentation and line breaks for easier reading.'],
      ['Can I pretty print an API response?', 'Yes, as long as the response body is valid strict JSON.'],
      ['Will pretty printing upload my JSON?', 'No. JSONFmt processes it in your browser.'],
      ['Is pretty printed JSON still valid?', 'Yes. Pretty printing keeps the same parsed data and changes only whitespace outside strings.'],
    ],
  }),
  tool({
    slug: 'json-error-finder',
    title: 'JSON Error Finder - Find the First Strict JSON Error',
    description: 'Use this JSON error finder in your browser to find the first strict JSON error, see the line and column, and repair the payload without uploading it.',
    heading: 'JSON error finder',
    summary: 'Use this JSON error finder to locate the first strict JSON syntax error, understand why it happened, and repair the text without sending it to a server.',
    primaryKeyword: 'json error finder',
    action: 'Find JSON errors',
    relatedGuideSlugs: [
      'json-parse-error',
      'unexpected-token-in-json',
      'unexpected-token-less-than-in-json',
      'unexpected-end-of-json-input',
    ],
    sections: [
      section('Find the first blocking syntax error', [
        'JSONFmt points to the line and column where strict JSON parsing stopped and pairs the location with nearby context.',
        'Common error patterns receive an explanation and a manual repair suggestion instead of a raw parser message alone.',
      ]),
      section('Repair JSON in small steps', [
        'Fix one reported issue, validate again, and repeat until the full document is valid. One missing quote or comma can hide later problems.',
        'The tool does not auto-rewrite your JSON, so you keep control of values that may be sensitive or business-critical.',
      ]),
      section('Use the context before changing data', [
        'A JSON error finder should make the next edit smaller, not encourage a broad rewrite. Check the nearby context, the previous line, and the surrounding braces before changing values.',
        'After one repair, run validation again because the parser can only report later syntax issues after the first blocking error is fixed.',
      ]),
    ],
    faq: [
      ['Why does JSONFmt show only one error at a time?', 'A parser must recover from the first syntax error before it can reliably inspect later text.'],
      ['Can it find trailing commas?', 'Yes. JSONFmt classifies several common strict JSON syntax patterns.'],
      ['Does the error finder upload API payloads?', 'No. Processing happens locally in the browser.'],
      ['What errors can JSON error finder explain?', 'It explains common issues such as missing commas, trailing commas, single quotes, comments, unclosed strings, and unquoted keys.'],
    ],
  }),
  tool({
    slug: 'fix-invalid-json',
    title: 'Fix Invalid JSON - Diagnose and Repair Strict JSON Errors',
    description: 'Fix invalid JSON by checking line and column, understanding the parser message, and making the smallest correct repair in your browser.',
    heading: 'Fix invalid JSON',
    summary: 'Fix invalid JSON by diagnosing the blocking parser error and making the smallest correct repair.',
    primaryKeyword: 'fix invalid json',
    action: 'Diagnose JSON',
    relatedGuideSlugs: [
      'json-parse-error',
      'single-quotes-in-json',
      'missing-comma-in-json',
      'unquoted-property-name-in-json',
    ],
    sections: [
      section('Start with the reported location', [
        'When JSON is invalid, the displayed line and column show where the parser could no longer continue. The real cause is often on that line or immediately before it.',
        'Check for missing commas, extra commas, mismatched brackets, comments, single quotes, unquoted keys, and unclosed strings before making a broad rewrite.',
      ]),
      section('Preserve the intended data', [
        'The safest fix is a small manual change followed by another validation pass. Blind replacements can change apostrophes, string values, or object structure.',
        'JSONFmt keeps all repair work local and gives you the context needed to decide what the input was meant to say.',
      ]),
      section('Fix syntax before formatting', [
        'Invalid JSON must become parseable before it can be formatted, minified, or viewed as a structure. Start with the first error and avoid changing unrelated parts of the payload.',
        'Once validation passes, format the repaired JSON and inspect the shape before using it in an API request, config file, or test fixture.',
      ]),
    ],
    faq: [
      ['Can JSONFmt automatically fix JSON?', 'No. It identifies likely syntax issues and lets you make the intended repair yourself.'],
      ['What causes invalid JSON most often?', 'Missing commas, trailing commas, single quotes, comments, and unmatched brackets are common causes.'],
      ['Can I fix a large JSON file here?', 'JSONFmt supports browser-local JSON input up to 10 MB.'],
      ['Should I format invalid JSON first?', 'No. Fix invalid JSON syntax first, then format the valid result for review.'],
    ],
  }),
  tool({
    slug: 'json-viewer',
    title: 'JSON Viewer Online - Validate and Read JSON Locally',
    description: 'Use a JSON viewer locally in your browser. Validate and format valid JSON into a readable structure without uploads or storage.',
    heading: 'JSON viewer',
    summary: 'Use this JSON viewer to open JSON in a readable local workspace, validate the syntax, and format the structure for inspection.',
    primaryKeyword: 'json viewer',
    action: 'View JSON',
    sections: [
      section('Read JSON with structure', [
        'A JSON viewer helps turn dense response text into a readable object and array layout. JSONFmt uses formatting and a structural summary to make valid JSON easier to inspect.',
        'This first version keeps the editor at the center of the experience, so you can view, correct, format, minify, and copy the same local text.',
      ]),
      section('Validate before you trust the layout', [
        'A document must be valid strict JSON before it can be reliably displayed as a structured value. Invalid input stays in the editor with a diagnostic rather than being silently guessed at.',
        'For deeply nested documents, formatting first makes object boundaries clearer and creates a practical reading view without sending content outside the browser.',
      ]),
      section('Inspect before copying onward', [
        'A JSON viewer gives you a safer pause between receiving data and sending it somewhere else. Review the formatted structure, check the root type, and confirm the field you care about is nested under the expected parent.',
        'When the text is invalid, switch from viewing to diagnostics and repair the first syntax issue before trusting any structural interpretation.',
      ]),
    ],
    faq: [
      ['Can JSONFmt display invalid JSON?', 'It displays the text and diagnostic, but a structured view requires valid JSON.'],
      ['Does JSONFmt have a tree viewer?', 'The current viewer focuses on formatted structure and diagnostics; tree navigation is a later enhancement.'],
      ['Is JSON viewing private?', 'Yes. JSONFmt processes the input locally in your browser.'],
      ['When should I use a JSON viewer?', 'Use it when valid JSON is too nested or compact to inspect comfortably as raw text.'],
    ],
  }),
]

export const TRUST_PAGES = [
  trust({
    path: '/privacy/',
    title: 'Privacy Policy - JSONFmt',
    description: 'Read the JSONFmt privacy policy. JSON is processed locally in your browser and is not uploaded or stored by this tool.',
    heading: 'Privacy Policy',
    sections: [
      ['Overview', [
        'JSONFmt is designed as a privacy-first JSON formatting and validation tool. The JSON you paste, type, import, or drag into the editor is processed locally in your browser.',
        'We do not operate a server-side JSON parser, account system, database, or cloud history for your JSON input.',
      ]],
      ['JSON content', [
        'Your JSON content is not uploaded, saved, sold, shared, or added to analytics events. Formatting, minifying, and syntax diagnosis happen on your device.',
        'Because JSON may contain secrets, tokens, personal data, or internal API responses, you should still review what you paste into any browser-based tool.',
      ]],
      ['Cookies and future advertising', [
        'V2 does not include live advertising scripts or analytics scripts. In the future, JSONFmt may use Google AdSense or similar advertising services. These services may use cookies, device identifiers, IP addresses, or similar technologies to deliver and measure ads.',
        'If advertising is added, this policy should be updated before those scripts are enabled.',
      ]],
      ['Contact', [
        `For privacy questions, contact the JSON Formatter team at ${CONTACT_EMAIL}.`,
      ]],
    ],
  }),
  trust({
    path: '/terms/',
    title: 'Terms of Use - JSONFmt',
    description: 'Read the JSONFmt terms of use for the free browser-based JSON formatter, validator, and error finder.',
    heading: 'Terms of Use',
    sections: [
      ['Using the tool', [
        'JSONFmt provides a free browser-based JSON formatter, validator, minifier, and syntax diagnostic tool. You may use it to inspect and repair JSON at your own discretion.',
        'The tool is provided for convenience and may not catch every possible issue in a workflow, schema, API contract, or downstream system.',
      ]],
      ['No warranty', [
        'JSONFmt is provided as is, without warranties of any kind. You are responsible for reviewing any output before using it in production systems, configuration files, or API requests.',
        'The tool does not intentionally change invalid JSON. It explains syntax issues so you can make the edit yourself.',
      ]],
      ['Acceptable use', [
        'Do not use JSONFmt to attack, overload, probe, or disrupt the site. Do not attempt to reverse engineer or bypass technical protections.',
        'Because JSON is processed locally, you remain responsible for the content you paste or import.',
      ]],
      ['Contact', [
        `Questions about these terms can be sent to ${CONTACT_EMAIL}.`,
      ]],
    ],
  }),
  trust({
    path: '/about/',
    title: 'About JSONFmt - Private JSON Formatter and Error Finder',
    description: 'Learn about JSONFmt, a browser-based JSON formatter and error finder built for developers who need fast, private validation.',
    heading: 'About JSONFmt',
    sections: [
      ['Why JSONFmt exists', [
        'JSONFmt helps developers diagnose invalid JSON quickly without sending their data to a server. The tool focuses on strict JSON validation, clear error explanations, formatting, minifying, and practical repair guidance.',
        'Many JSON tools simply say that a document is invalid. JSONFmt tries to make the next step obvious: where the parser failed, what likely caused it, and how to fix the syntax manually.',
      ]],
      ['Built for developers', [
        'The interface is intentionally close to a development workspace. The editor is the center of the page, diagnostics stay nearby, and privacy language is visible without getting in the way.',
        'The guide library explains common JSON syntax problems with invalid examples, fixed examples, and short troubleshooting notes.',
      ]],
      ['Who maintains it', [
        `JSONFmt is maintained by the JSON Formatter team. For feedback, corrections, or content suggestions, contact ${CONTACT_EMAIL}.`,
      ]],
    ],
  }),
  trust({
    path: '/contact/',
    title: 'Contact JSONFmt',
    description: 'Contact the JSON Formatter team for feedback, corrections, privacy questions, or JSONFmt site issues.',
    heading: 'Contact',
    sections: [
      ['Get in touch', [
        `For feedback, corrections, privacy questions, or site issues, email the JSON Formatter team at ${CONTACT_EMAIL}.`,
        'Please do not email private JSON payloads, API tokens, passwords, customer data, or production secrets. Describe the issue without including sensitive data whenever possible.',
      ]],
      ['What to include', [
        'If you are reporting a documentation issue, include the page URL and a short description. If you are reporting a tool behavior issue, include the browser name and a simplified example that does not contain private data.',
      ]],
    ],
  }),
]

export const GUIDES_INDEX = {
  kind: 'guides-index',
  path: '/guides/',
  canonical: `${SITE_URL}/guides/`,
  title: 'JSON Error Guides - Fix JSON Parse and Syntax Errors',
  description: 'Developer-focused guides for fixing JSON parse errors, unexpected tokens, missing commas, quotes, brackets, comments, and invalid API responses.',
}

export const GUIDE_GROUPS = [
  {
    title: 'JSON syntax errors',
    summary: 'Diagnose parser messages, invalid characters, missing separators, and strict JSON syntax failures.',
    slugs: [
      'trailing-comma-in-json',
      'unexpected-token-in-json',
      'unexpected-end-of-json-input',
      'bad-control-character-in-json',
      'missing-comma-in-json',
      'expected-double-quoted-property-name',
      'single-quotes-in-json',
      'unquoted-property-name-in-json',
      'unclosed-string-in-json',
      'comments-in-json',
      'unexpected-token-less-than-in-json',
      'json-parse-error',
    ],
  },
  {
    title: 'Formatting and validation workflows',
    summary: 'Use formatting, validation, minification, and tool choice in the right order.',
    slugs: [
      'how-to-format-json',
      'how-to-validate-json',
      'how-to-minify-json',
      'json-formatter-vs-validator',
    ],
  },
  {
    title: 'Safety and format choices',
    summary: 'Choose strict JSON, JSON5, and browser-local formatting safely.',
    slugs: [
      'strict-json-vs-json5',
      'is-online-json-formatter-safe',
    ],
  },
  {
    title: 'Runtime and serialization errors',
    summary: 'Debug JSON.parse, fetch response, serialization, hidden character, numeric, and multi-value JSON failures.',
    slugs: PHASE2_GUIDE_SLUGS,
  },
]

export const TOOLS_INDEX = {
  kind: 'tools-index',
  path: '/tools/',
  canonical: `${SITE_URL}/tools/`,
  title: 'JSON Tools - Formatter, Validator, Minifier, and Error Finder',
  description: 'Use privacy-first JSON tools to format, validate, minify, view, and diagnose strict JSON locally in your browser.',
}

export const HOME_PAGE = {
  kind: 'home',
  path: '/',
  canonical: `${SITE_URL}/`,
  title: 'JSON Formatter, Validator, Minifier & Error Finder | JSONFmt',
  description: 'Format, validate, minify, and repair strict JSON locally in your browser with browser-only tools for API payloads, configs, and logs.',
}

export const PAGE_ROUTES = [
  HOME_PAGE,
  TOOLS_INDEX,
  ...TOOL_PAGES,
  GUIDES_INDEX,
  ...GUIDE_PAGES,
  ...TRUST_PAGES,
]

function getExtraGuideSections(slug) {
  return ({
  'trailing-comma-in-json': [
    section('Checklist before you send the JSON', [
      'After removing a trailing comma, check the surrounding object or array instead of validating only that one line. A trailing comma often appears after a manual edit, and the same edit may have left another property without a comma above it. Confirm that every item before the final item is separated correctly, then run the validator again.',
      'If the payload came from source code, look for JavaScript-specific syntax before using it as JSON. A copied object literal may also contain comments, single quotes, `undefined`, or unquoted keys. Fixing the trailing comma is only the first step if the source was not strict JSON in the first place.',
    ]),
    section('How to prevent trailing comma regressions', [
      'For shared configuration files, prefer generated JSON or an editor formatter that validates strict JSON on save. If your team wants comments and trailing commas in configuration, consider using a format that explicitly supports them, then convert to strict JSON only at the boundary where an API or parser requires it.',
      'For API examples in documentation, keep the example payloads strict. Readers often copy examples directly into Postman, curl, SDK tests, or online validators. A single trailing comma can make the example look broken even when the API contract is correct.',
    ]),
  ],
  'unexpected-token-in-json': [
    section('A practical debugging order', [
      'Treat the parser message as a starting point, not a final diagnosis. First identify the token reported by the parser. Then inspect the previous non-whitespace character. If the token is a quote and the previous value already ended, a comma is probably missing. If the token is a brace after a comma, the comma is probably extra.',
      'Next, check whether the file is actually JSON. Unexpected token errors are common when an HTML error page, JavaScript object, YAML file, or plain text response is accidentally parsed as JSON. If the first character is `<`, the server may have returned HTML. If keys are unquoted, the text may be JavaScript-style data rather than JSON.',
    ]),
    section('When the error comes from an API response', [
      'In browser or Node.js code, unexpected token errors often appear after calling `response.json()`. The bug may not be in your JSON editor at all. The response might be empty, truncated, compressed incorrectly, or replaced by a login page or server error. Always check the raw response body and status code before assuming the client parser is wrong.',
      'If you paste the raw response into JSONFmt and the same category appears, repair the payload or fix the API output. If JSONFmt says the pasted response is valid, the issue may be transport related, such as double parsing, wrong content type, or application code reading the response stream twice.',
    ]),
  ],
  'single-quotes-in-json': [
    section('Safe replacement strategy', [
      'Do not replace every apostrophe blindly. The unsafe pattern is to run a global replacement from single quote to double quote without understanding string boundaries. That can corrupt values like names, contractions, or text copied from logs. Instead, replace only the quote characters that start and end JSON keys or string values.',
      'A safer workflow is to fix the outer delimiters, validate, and then deal with any new error reported by the parser. If a value contains a double quote, escape it as `\\"`. If a value contains an apostrophe and the string uses double quotes, the apostrophe can remain unchanged.',
    ]),
    section('Why this matters in real API work', [
      'APIs that accept JSON usually parse the request body with a strict JSON parser. A payload that worked in a JavaScript test file can fail when sent over HTTP because the server receives text, not a JavaScript object. The server does not know about JavaScript variables, single-quoted strings, or object literal shortcuts.',
      'When writing examples for teammates or customers, always publish strict JSON. This prevents confusing support issues where the example appears correct to a JavaScript developer but fails in Python, Go, Java, curl, or an API gateway that uses a standards-compliant parser.',
    ]),
  ],
  'unquoted-property-name-in-json': [
    section('Keys that look simple still need quotes', [
      'The rule applies even when the key is a plain identifier such as `name`, `id`, or `enabled`. JSON does not make an exception for simple words. Every key is a string and every string key needs double quotes. This is different from JavaScript, where a bare identifier can be used as an object property name.',
      'The rule also protects less simple keys. Real API payloads often contain keys such as `request-id`, `user.name`, `x-api-version`, or `content type`. Quoting every key makes those names legal without inventing special cases for each punctuation mark or whitespace character.',
    ]),
    section('Fixing generated examples and docs', [
      'If the invalid JSON came from documentation, check whether the page labels the example as JavaScript or JSON. Many guides show JavaScript objects because they are easier to read in code snippets. Before using the example in an API client, convert it to strict JSON by quoting keys, using double quotes for strings, and removing comments.',
      'If the invalid JSON came from an application log, the log may be printing an object representation instead of serializing JSON. In that case, fix the logging or export step if you control it. A real JSON serializer is safer than editing many keys by hand.',
    ]),
  ],
  'unclosed-string-in-json': [
    section('Look for the first broken boundary', [
      'When a string is unclosed, later syntax highlighting can become misleading because the editor may treat the rest of the file as part of the same string. Do not chase every highlighted problem at once. Find the first opening quote that does not have a matching closing quote and fix that boundary first.',
      'The missing quote may be caused by copied multiline text, an unescaped double quote inside a message, or a truncated file. If the JSON came from a network response, also check whether the response body was cut off before the full payload arrived.',
    ]),
    section('Escaping without changing the meaning', [
      'The goal is to preserve the intended string value while making it legal JSON. Use `\\n` for a line break, `\\"` for a quote inside the value, and `\\\\` for a literal backslash. These escape sequences represent characters inside the value; they are not extra text the application should display.',
      'After escaping, validate the whole document and then inspect the parsed value in the application that consumes it. This is especially important for messages, regular expressions, Windows paths, and shell commands, where backslashes and quotes may already have meaning in another layer.',
    ]),
  ],
  'comments-in-json': [
    section('What to use instead of comments', [
      'If the JSON is an API request or response, put explanations in documentation, not inside the payload. If the JSON is a config file that humans edit often, decide whether strict JSON is the right format. YAML, TOML, JSONC, or JSON5 may be more appropriate for internal configuration, but they should not be sent to systems that expect strict JSON.',
      'Some teams use `_comment` properties, but that is a data change, not a syntax feature. It can break schemas, cause unknown-field errors, or accidentally ship notes to production systems. Use this pattern only when the consuming system explicitly allows extra fields.',
    ]),
    section('Comments can hide real payload issues', [
      'When a parser stops at `//`, it may not reach later errors in the document. After removing comments, validate again and be ready to fix additional strict JSON issues such as single quotes, trailing commas, or unquoted keys. This staged repair process is safer than trying to guess every problem at once.',
      'For shared examples, keep comments outside the JSON block. A short paragraph before or after the code sample gives readers the explanation without making the payload invalid. That habit helps API examples work across curl, Postman, SDK tests, CI jobs, and online validators.',
    ]),
  ],
  'how-to-format-json': [
    section('Use formatting in a repeatable workflow', [
      'When JSON is part of a recurring development workflow, format the payload before reviewing changes and keep the result under version control when it is a fixture or configuration file. Readable indentation makes diffs smaller and makes it easier for another developer to see whether a value changed or only the layout changed. For generated JSON, format a copy for inspection rather than editing a production output by hand.',
      'If you need to pass formatted JSON into another application, copy the complete validated result instead of reconstructing individual fragments. A single missing brace can undo the benefit of a clean layout. JSONFmt lets you validate, format, and copy in one local session, which keeps the review step close to the final text you will use.',
      'Use the same formatter settings across examples, fixtures, and documentation whenever possible. Consistent output makes it easier to compare a response captured today with one captured later, and it prevents a style-only change from obscuring the data change that actually matters.',
    ]),
  ],
  'how-to-validate-json': [
    section('Build validation into your handoff', [
      'Treat JSON validation as a checkpoint before handing data to another person, service, or environment. A quick local validation step can prevent a broken example from reaching documentation, a malformed request from reaching an API, or an invalid config from blocking a deployment. It is especially useful after manually editing a payload that was originally produced by a serializer.',
      'When a document passes validation, save the source in the form that suits the next task. Format it for human review, minify it only when compact size matters, and keep a small redacted sample for debugging instead of copying a sensitive production payload. That workflow protects both syntax quality and the confidentiality of the data.',
      'For automated workflows, validate generated files in tests or CI before release. A local browser validator is useful for investigation, while a repeatable parser check in the project catches accidental syntax regressions before another environment has to diagnose them.',
    ]),
  ],
  'how-to-minify-json': [
    section('Use minification at the right boundary', [
      'Minify JSON at the point where a compact representation is actually needed, such as a generated asset, embedded fixture, or constrained transport channel. Keep the editable source formatted whenever people are expected to read it. That separation avoids a common maintenance problem where a compact one-line configuration becomes the only copy and every later change is harder to review.',
      'Before shipping compact JSON, compare its behavior with the formatted version in the consuming application. Minification should not change the parsed result, but the receiving system can still impose schema, size, encoding, or content-type rules that are outside the JSON grammar. A clean validation result proves syntax, while an end-to-end check proves the surrounding integration.',
      'Keep a readable source beside any minified output when the project allows it. This gives developers a straightforward way to inspect future changes, regenerate the compact result, and isolate whether a problem came from the JSON itself or from a later transport, schema, or application rule.',
      'If you are unsure whether minification is worth it, measure the size before and after. Small payloads often shrink only a little, while large nested documents may save enough bytes to matter. That quick comparison helps you decide whether the compact form is actually useful.',
    ]),
  ],
  'json-formatter-vs-validator': [
    section('Choose the tool from the failure mode', [
      'Use the validator when a parser fails, an API rejects a body before processing it, or a copied snippet may contain JavaScript-style syntax. The outcome you need is a precise explanation of what prevents strict parsing. Use the formatter when the JSON is already valid but the structure is too dense to inspect, compare, or discuss confidently.',
      'Keeping these jobs separate also helps a team communicate clearly. A report that says "the JSON is invalid because the final property has a trailing comma" leads to a focused repair. A request to "format the valid response so we can inspect the nested array" describes a presentation task. JSONFmt supports both steps locally without turning formatting into a risky automatic repair feature.',
      'The distinction also improves debugging speed. Validation narrows down whether the parser can read the text at all, while formatting helps a person verify the shape after parsing succeeds. Moving through those two steps in order keeps syntax failures separate from data or integration questions.',
      'A tidy rule of thumb is simple: if the JSON cannot be parsed, validate it; if the JSON can be parsed but is hard to read, format it. That habit prevents teams from treating presentation as if it were syntax and keeps the review process direct.',
    ]),
  ],
  'missing-comma-in-json': [
    section('Quick checklist for comma repairs', [
      'Check whether the previous value is complete before adding a comma. A complete value can be a string, number, boolean, null, object, or array. If another property or array item follows immediately, a comma belongs between them. If the next character closes the object or array, do not add a comma there.',
      'After the repair, search nearby lines for the opposite mistake: trailing commas. Developers often add a missing separator correctly, then leave an extra comma after the final item during the same edit. Validate after each small change so you know which edit fixed or introduced the next parser message.',
    ]),
  ],
  'expected-double-quoted-property-name': [
    section('Checklist before changing object keys', [
      'Confirm whether the parser is pointing at a real key, a closing brace, or a JavaScript-only value. A real key should be quoted. A closing brace after a comma means the comma should be removed. A value like `undefined` means the payload is not strict JSON and needs a data decision, not just quote changes.',
      'If the object came from code, export it through a serializer instead of repairing many keys manually. Manual key repair is fine for a small pasted example, but generated payloads should come from code that already understands strict JSON boundaries.',
    ]),
  ],
  'json-parse-error': [
    section('Checklist for narrowing a parse error', [
      'First confirm the input type: raw text, already parsed object, empty body, HTML page, or strict JSON. Second, inspect the first non-whitespace character and the reported line and column. Third, check the previous meaningful character for a missing comma, extra comma, or unclosed string.',
      'If the parser error appears only in one environment, compare the exact bytes or raw response text between environments. Encoding, truncation, redirects, and middleware can change what reaches the parser even when the application code looks the same.',
    ]),
  ],
  'unexpected-token-less-than-in-json': [
    section('Checklist for HTML returned to JSON clients', [
      'Check the request URL, final redirected URL, status code, content type, and raw body. If the body is an HTML document, the parser is correctly rejecting it. The bug is usually routing, authentication, proxy configuration, or an error handler returning HTML to an API client.',
      'For frontend code, handle non-JSON responses before calling `response.json()`. For backend code, return a JSON error body from API routes even when the status is 404 or 500. Consistency keeps the client parser from becoming the first place the real server problem appears.',
    ]),
  ],
  'strict-json-vs-json5': [
    section('Checklist for choosing strict JSON or JSON5', [
      'Choose strict JSON when data crosses system boundaries: APIs, SDK examples, generated responses, shared fixtures, deployment files, and documentation copied by users in different languages. Choose JSON5 only when a specific local tool or config loader documents support for it.',
      'If a file starts as JSON5 but must be sent to an API, convert it at the boundary and validate the strict output. Keep the relaxed source only where the relaxed parser is guaranteed. This avoids surprises when another tool in the chain uses a standard JSON parser. Public examples should label the format clearly for readers and teammates.',
    ]),
  ],
  'is-online-json-formatter-safe': [
    section('Checklist for private payloads', [
      'Before using any web formatter, decide whether the payload includes credentials, personal data, customer records, private URLs, financial values, or production identifiers. If it does, redact first or create a minimal structural sample that reproduces the syntax problem without exposing the original values.',
      'After the task, clear the editor and avoid storing formatted private output in shared notes, tickets, or chat logs. A browser-local tool reduces upload risk, but privacy also depends on what you copy, screenshot, save, and share after formatting.',
    ]),
  ],
  })[slug] ?? []
}

export function renderStaticPage(page, options = {}) {
  const cssLinks = options.cssLinks ?? []
  const scriptLinks = options.scriptLinks ?? []
  const jsonLd = getStructuredData(page)
  const searchConsoleVerificationMeta = getSearchConsoleVerificationMeta()
  const cloudflareWebAnalyticsScript = getCloudflareWebAnalyticsScript()
  const body = page.kind === 'tool' || page.kind === 'home'
    ? `<div id="root">${renderStaticBody(page)}</div>
    ${scriptLinks.map((href) => `<script type="module" crossorigin src="${href}"></script>`).join('\n    ')}`
    : `<main class="static-shell">
      ${renderStaticHeader()}
      ${renderStaticBody(page)}
      ${renderStaticFooter()}
    </main>`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="index,follow">
    ${searchConsoleVerificationMeta}
    <link rel="icon" type="image/png" href="/JSON.png">
    <link rel="apple-touch-icon" href="/JSON.png">
    <link rel="canonical" href="${page.canonical}">
    <meta property="og:type" content="${page.kind === 'guide' ? 'article' : 'website'}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${page.canonical}">
    <meta property="og:image" content="${SITE_URL}/JSON.png">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:image" content="${SITE_URL}/JSON.png">
    ${cssLinks.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n    ')}
    ${jsonLd.map((data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`).join('\n    ')}
  </head>
  <body>
    ${body}
    ${cloudflareWebAnalyticsScript}
  </body>
</html>
`
}

function getSearchConsoleVerificationMeta() {
  const token = process.env.GOOGLE_SITE_VERIFICATION?.trim()
  if (!token) return ''

  return `<meta name="google-site-verification" content="${escapeHtml(token)}">`
}

function getCloudflareWebAnalyticsScript() {
  if (!CLOUDFLARE_WEB_ANALYTICS_TOKEN) return ''

  return `<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "${CLOUDFLARE_WEB_ANALYTICS_TOKEN}"}'></script><!-- End Cloudflare Web Analytics -->`
}

export function buildSitemapXml() {
  const urls = PAGE_ROUTES.map((page) => `  <url>
    <loc>${page.canonical}</loc>
    <lastmod>${today}</lastmod>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}

export async function writeStaticPages(distDir = 'dist') {
  const cssLinks = await getBuiltCssLinks(distDir)
  const scriptLinks = await getBuiltScriptLinks(distDir)

  for (const page of [HOME_PAGE, TOOLS_INDEX, ...TOOL_PAGES, GUIDES_INDEX, ...GUIDE_PAGES, ...TRUST_PAGES]) {
    const outputPath = path.join(distDir, page.path, 'index.html')
    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(
      outputPath,
      renderStaticPage(page, {
        cssLinks,
        scriptLinks: page.kind === 'tool' || page.kind === 'home' ? scriptLinks : [],
      }),
      'utf8',
    )
  }

  await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(), 'utf8')
  await writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt(), 'utf8')
}

function guide(config) {
  const pathName = `/guides/${config.slug}/`
  return {
    kind: 'guide',
    path: pathName,
    canonical: `${SITE_URL}${pathName}`,
    ...config,
    sections: [
      ...config.sections,
      ...getExtraGuideSections(config.slug),
      ...getStandardGuideSections(config),
    ],
  }
}

function tool(config) {
  const pathName = `/${config.slug}/`
  return {
    kind: 'tool',
    path: pathName,
    canonical: `${SITE_URL}${pathName}`,
    ...config,
    sections: [
      ...config.sections,
      ...getStandardToolSections(config),
    ],
  }
}

function getStandardToolSections(config) {
  return [
    section('Keep JSON private while you work', [
      `The ${config.primaryKeyword} runs in the browser, so pasted JSON, imported files, and generated output stay on your device during the task.`,
      'Use the local workspace for API responses, logs, configuration files, and examples that may contain private values. Replace secrets before sharing screenshots or support examples.',
    ]),
  ]
}

function getStandardGuideSections(config) {
  return [
    section('Final validation workflow', [
      `After you fix ${config.primaryKeyword}, validate the complete document instead of copying the edited fragment immediately. JSON errors are often chained: one syntax issue prevents the parser from reaching the next one. A document that fails once may reveal a different error after the first repair. Work in small steps until the entire payload is valid.`,
      'When the validator reports success, format the JSON and scan the indentation. Correct indentation makes object and array boundaries visible, which helps you catch structural surprises before using the payload in an API request, a configuration file, or a test fixture. If the formatted shape does not match what you expected, review the data before sending it downstream.',
      'Keep private payloads private during this process. JSONFmt runs in your browser and does not upload your input, but you should still avoid pasting secrets into screenshots, support tickets, or public issue reports. When you need help from another person, reduce the payload to a minimal example that reproduces the syntax problem without exposing production data.',
    ]),
  ]
}

function trust(config) {
  return {
    kind: 'trust',
    canonical: `${SITE_URL}${config.path}`,
    ...config,
  }
}

function section(heading, paragraphs) {
  return { heading, paragraphs }
}

function renderStaticHeader() {
  return `<header class="static-topbar">
  <a class="brand" href="/" aria-label="JSONFmt home"><span class="brand-mark">{ }</span><span>JSONFmt</span></a>
  <nav class="static-nav" aria-label="Primary navigation">
    <a href="/json-formatter/">Formatter</a>
    <a href="/json-validator/">Validator</a>
    <a href="/json-minifier/">Minifier</a>
    <a href="/json-error-finder/">Error Finder</a>
    <a href="/tools/">Tools</a>
    <a href="/guides/">Guides</a>
  </nav>
</header>`
}

function renderStaticFooter() {
  return `<footer class="static-footer">
  <span>JSON processed locally in your browser.</span>
  <nav aria-label="Footer navigation">
    <a href="/tools/">Tools</a>
    <a href="/json-formatter/">Formatter</a>
    <a href="/json-validator/">Validator</a>
    <a href="/json-minifier/">Minifier</a>
    <a href="/guides/">Guides</a>
    <a href="/privacy/">Privacy Policy</a>
    <a href="/terms/">Terms of Use</a>
    <a href="/contact/">Contact</a>
  </nav>
</footer>`
}

function renderStaticBody(page) {
  if (page.kind === 'home') return renderHomePage()
  if (page.kind === 'tools-index') return renderToolsIndex()
  if (page.kind === 'tool') return renderToolPage(page)
  if (page.kind === 'guides-index') return renderGuidesIndex()
  if (page.kind === 'guide') return renderGuidePage(page)
  return renderTrustPage(page)
}

function renderHomePage() {
  const featuredGuides = [
    'unexpected-token-in-json',
    'single-quotes-in-json',
    'unexpected-non-whitespace-character-after-json',
    'unexpected-token-less-than-in-json',
    'json-parse-unexpected-token-o',
    'json-parse-unexpected-token-u',
    'invalid-escape-character-in-json',
    'unexpected-end-of-json-input',
    'trailing-comma-in-json',
  ].map((slug) => GUIDE_PAGES.find((guidePage) => guidePage.slug === slug)).filter(Boolean)

  return `<main class="app-shell">
  <section class="workspace" aria-label="JSON formatter, validator, and error finder">
    <header class="topbar">
      <a class="brand" href="/" aria-label="JSONFmt home"><span class="brand-mark">{ }</span><span>JSONFmt</span></a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="/json-formatter/">Formatter</a>
        <a href="/json-validator/">Validator</a>
        <a href="/json-minifier/">Minifier</a>
        <a href="/json-error-finder/">Error Finder</a>
        <a href="/tools/">Tools</a>
        <a href="/guides/">Guides</a>
      </nav>
      <div class="privacy-note"><span>Runs locally in your browser</span></div>
    </header>

    <div class="intro" id="top">
      <div>
        <p class="eyebrow">Privacy-first JSON workspace</p>
        <h1>JSON formatter, validator, and error finder</h1>
        <p class="lead">Format, validate, minify, and repair strict JSON locally in your browser for API payloads, configs, and logs.</p>
        <p class="tool-context">Paste JSON to validate as you type.</p>
      </div>
      <div class="input-stats" aria-label="Input statistics">
        <span>Sample JSON</span>
        <span>Runs locally</span>
      </div>
    </div>

    <div class="home-tool-layout">
      <section class="editor-panel home-input-panel" aria-label="JSON input preview">
        <div class="panel-toolbar">
          <div class="editor-label"><span class="state-dot valid" aria-hidden="true"></span><span>JSON Input</span></div>
        </div>
        <pre class="output-code"><code>{
  &quot;service&quot;: &quot;JSONFmt&quot;,
  &quot;private&quot;: true,
  &quot;tasks&quot;: [&quot;format&quot;, &quot;validate&quot;, &quot;minify&quot;]
}</code></pre>
        <div class="editor-footer">
          <span>The interactive editor loads on this page.</span>
          <span>Strict JSON only</span>
        </div>
      </section>

      <div class="workspace-actions" role="toolbar" aria-label="JSON actions">
        <a class="command-button primary" href="/json-formatter/"><span>Format JSON</span></a>
        <a class="command-button" href="/json-validator/"><span>Validate</span></a>
        <a class="command-button" href="/json-minifier/"><span>Minify</span></a>
      </div>

      <aside class="output-panel" aria-label="JSON output preview">
        <div class="output-toolbar">
          <div class="editor-label"><span class="state-dot valid" aria-hidden="true"></span><span>Formatted Output</span></div>
        </div>
        <div class="output-body">
          <pre class="output-code"><code>{
  &quot;service&quot;: &quot;JSONFmt&quot;,
  &quot;private&quot;: true,
  &quot;tasks&quot;: [
    &quot;format&quot;,
    &quot;validate&quot;,
    &quot;minify&quot;
  ]
}</code></pre>
        </div>
      </aside>
    </div>

    <section class="privacy-band" aria-label="Privacy notice">
      <div>
        <strong>Your JSON stays in your browser.</strong>
        <span>It is parsed locally and is never uploaded, saved, or shared.</span>
      </div>
    </section>

    ${renderPriorityGuides()}

    <section class="tool-entry-band" aria-labelledby="tools-title">
      <div>
        <p class="eyebrow">JSON tools</p>
        <h2 id="tools-title">Choose the exact task.</h2>
      </div>
      <div class="tool-entry-grid">
        ${TOOL_PAGES.map((toolPage) => `<a class="tool-entry-link" href="${toolPage.path}">
          <span><strong>${escapeHtml(toolPage.heading)}</strong><small>${escapeHtml(toolPage.summary)}</small></span>
        </a>`).join('\n        ')}
      </div>
    </section>

    <section class="guides-band" aria-labelledby="guides-title">
      <div>
        <p class="eyebrow">JSON error guides</p>
        <h2 id="guides-title">Fix the syntax issue, then validate here.</h2>
      </div>
      <div class="guide-links">
        ${featuredGuides.map((guidePage) => `<a href="${guidePage.path}"><span>${escapeHtml(guidePage.title)}</span></a>`).join('\n        ')}
      </div>
    </section>

    <section class="faq" aria-labelledby="faq-title">
      <div>
        <p class="eyebrow">Quick answers</p>
        <h2 id="faq-title">Built for the moment JSON breaks.</h2>
      </div>
      <div class="faq-grid">
        <article><h3>Is my JSON uploaded?</h3><p>No. JSONFmt processes JSON locally in your browser.</p></article>
        <article><h3>Why is JSON invalid?</h3><p>Missing commas, single quotes, unclosed strings, and unmatched brackets are common causes.</p></article>
        <article><h3>Does JSONFmt support JSON5?</h3><p>No. JSONFmt validates strict standard JSON only.</p></article>
      </div>
    </section>

    <footer class="site-footer">
      <span>JSONFmt is maintained by the JSON Formatter team.</span>
      <nav aria-label="Footer navigation">
        <a href="/tools/">All tools</a>
        <a href="/json-formatter/">Formatter</a>
        <a href="/json-validator/">Validator</a>
        <a href="/json-minifier/">Minifier</a>
        <a href="/guides/">Guides</a>
        <a href="/privacy/">Privacy Policy</a>
        <a href="/terms/">Terms of Use</a>
        <a href="/contact/">Contact</a>
      </nav>
    </footer>
  </section>
</main>`
}

function renderToolsIndex() {
  return `<section class="static-hero">
  <p class="eyebrow">Browser-local JSON utilities</p>
  <h1>JSON tools for the task in front of you.</h1>
  <p class="static-lead">Format, validate, minify, view, and diagnose strict JSON without sending the content to a server.</p>
</section>
<section class="tool-card-grid" aria-label="JSON tool list">
  ${TOOL_PAGES.map((toolPage) => `<article class="tool-card">
    <p>${escapeHtml(toolPage.primaryKeyword)}</p>
    <h2><a href="${toolPage.path}">${escapeHtml(toolPage.heading)}</a></h2>
    <span>${escapeHtml(toolPage.summary)}</span>
    <a class="tool-card-link" href="${toolPage.path}">${escapeHtml(toolPage.action)}</a>
  </article>`).join('\n  ')}
</section>
<section class="entry-guides">
  <div>
    <p class="eyebrow">Need a correction?</p>
    <h2>Start with a practical JSON guide.</h2>
  </div>
  <div class="entry-link-list">
    ${GUIDE_PAGES.slice(0, 6).map((guidePage) => `<a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a>`).join('\n    ')}
  </div>
</section>`
}

function renderGuidesIndex() {
  return `<section class="static-hero">
  <p class="eyebrow">JSON error guides</p>
  <h1>Fix common JSON syntax errors.</h1>
  <p class="static-lead">Practical explanations for parser errors, formatting workflows, and safe browser-local JSON handling.</p>
</section>
${renderPriorityGuides()}
${GUIDE_GROUPS.map((group) => {
  const groupPages = group.slugs.map((slug) => GUIDE_PAGES.find((guidePage) => guidePage.slug === slug)).filter(Boolean)

  return `<section class="guide-group" aria-labelledby="${slugify(group.title)}">
  <div class="guide-group-heading">
    <p class="eyebrow">${escapeHtml(group.title)}</p>
    <h2 id="${slugify(group.title)}">${escapeHtml(group.title)}</h2>
    <p>${escapeHtml(group.summary)}</p>
  </div>
  <div class="guide-card-grid" aria-label="${escapeHtml(group.title)} guide list">
    ${groupPages.map((guidePage) => `<article class="guide-card">
      <p>${escapeHtml(guidePage.primaryKeyword)}</p>
      <h2><a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a></h2>
      <span>${escapeHtml(guidePage.summary)}</span>
    </article>`).join('\n    ')}
  </div>
</section>`
}).join('\n')}`
}

function renderGuidePage(page) {
  return `<article class="article-shell">
  <p class="eyebrow">JSON syntax guide</p>
  <h1>${escapeHtml(page.title)}</h1>
  <p class="article-updated">${escapeHtml(contentUpdatedLabel)}</p>
  <p class="static-lead">${escapeHtml(page.summary)}</p>
  ${page.searchAnswer ? `<section class="article-answer" aria-label="Quick answer">
    <p class="eyebrow">Quick answer</p>
    <p>${escapeInlineCode(page.searchAnswer)}</p>
    ${page.fixSteps?.length ? `<ol>
      ${page.fixSteps.map((step) => `<li>${escapeInlineCode(step)}</li>`).join('\n      ')}
    </ol>` : ''}
  </section>` : ''}
  ${renderGuideFixPath(page)}
  <div class="article-cta top"><a href="/json-error-finder/">Try it in JSON Error Finder</a></div>
  <nav class="article-toc" aria-label="Article sections">
    <strong>On this page</strong>
    ${page.sections.map((item) => `<a href="#${slugify(item.heading)}">${escapeHtml(item.heading)}</a>`).join('')}
    <a href="#faq">FAQ</a>
  </nav>
  <section class="code-comparison" aria-label="Invalid and fixed JSON examples">
    <div>
      <span>Invalid JSON</span>
      <pre><code>${escapeHtml(page.invalidCode)}</code></pre>
    </div>
    <div>
      <span>Fixed JSON</span>
      <pre><code>${escapeHtml(page.fixedCode)}</code></pre>
    </div>
  </section>
  ${page.sections.slice(0, 2).map(renderArticleSection).join('\n')}
  ${renderAdPlaceholder('Reserved article placement')}
  ${page.sections.slice(2).map(renderArticleSection).join('\n')}
  ${renderFaq(page.faq)}
  ${renderAdPlaceholder('Reserved end-of-article placement')}
  ${renderRelatedLinks(page)}
  ${renderGuideClusterLinks(page)}
  <div class="article-cta"><a href="/json-error-finder/">Try it in JSON Error Finder</a></div>
</article>`
}

function renderToolPage(page) {
  return `<main class="static-shell">
  ${renderStaticHeader()}
  <section class="static-hero tool-hero">
    <p class="eyebrow">Privacy-first JSON tool</p>
    <h1>${escapeHtml(page.heading)}</h1>
    <p class="static-lead">${escapeHtml(page.summary)}</p>
  </section>
  <section class="tool-preview-grid" aria-label="${escapeHtml(page.heading)} workspace preview">
    <div class="tool-preview">
      <div class="tool-preview-bar"><span>JSON input</span><span>Runs locally</span></div>
      <pre><code>{
  "service": "JSONFmt",
  "private": true,
  "tasks": ["format", "validate", "minify"]
}</code></pre>
    </div>
    <aside class="tool-preview-result">
      <p class="eyebrow">${escapeHtml(page.action)}</p>
      <h2>Open the local workspace.</h2>
      <p>The interactive JSON editor loads on this page. Paste JSON, inspect the result, and keep the data in your browser.</p>
    </aside>
  </section>
  <article class="article-shell tool-copy">
    ${renderToolErrorCluster(page)}
    ${page.sections.map(renderArticleSection).join('\n')}
    ${renderFaq(page.faq)}
    ${renderRelatedLinks(page)}
  </article>
  ${renderStaticFooter()}
</main>`
}

function renderTrustPage(page) {
  return `<article class="article-shell trust-page">
  <p class="eyebrow">JSONFmt</p>
  <h1>${escapeHtml(page.heading)}</h1>
  <p class="static-lead">${escapeHtml(page.description)}</p>
  ${page.sections.map(([heading, paragraphs]) => `<section id="${slugify(heading)}">
    <h2>${escapeHtml(heading)}</h2>
    ${paragraphs.map((paragraph) => `<p>${linkifyEmail(escapeInlineCode(paragraph))}</p>`).join('\n    ')}
  </section>`).join('\n')}
</article>`
}

function renderArticleSection(item) {
  return `<section id="${slugify(item.heading)}">
  <h2>${escapeHtml(item.heading)}</h2>
  ${item.paragraphs.map((paragraph) => `<p>${escapeInlineCode(paragraph)}</p>`).join('\n  ')}
</section>`
}

function renderFaq(faq) {
  return `<section id="faq" class="article-faq">
  <h2>Frequently Asked Questions</h2>
  ${faq.map(([question, answer]) => `<h3>${escapeHtml(question)}</h3>
  <p>${escapeInlineCode(answer)}</p>`).join('\n  ')}
</section>`
}

function renderRelatedLinks(page) {
  const relatedTools = page.relatedToolSlugs
    ? page.relatedToolSlugs
      .map((slug) => TOOL_PAGES.find((toolPage) => toolPage.slug === slug))
      .filter((toolPage) => toolPage && toolPage.path !== page.path)
    : TOOL_PAGES.filter((toolPage) => toolPage.path !== page.path).slice(0, 4)
  const relatedGuides = page.relatedGuideSlugs
    ? page.relatedGuideSlugs
      .map((slug) => GUIDE_PAGES.find((guidePage) => guidePage.slug === slug))
      .filter(Boolean)
    : GUIDE_PAGES.filter((guidePage) => guidePage.path !== page.path).slice(0, 4)

  return `<section class="related-links">
  <div>
    <p class="eyebrow">Related JSON tools</p>
    ${relatedTools.map((toolPage) => `<a href="${toolPage.path}">${escapeHtml(toolPage.heading)}</a>`).join('\n    ')}
  </div>
  <div>
    <p class="eyebrow">Related guides</p>
    ${relatedGuides.map((guidePage) => `<a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a>`).join('\n    ')}
  </div>
</section>`
}

function renderPriorityGuides() {
  const priorityGuides = PRIORITY_GUIDE_SLUGS
    .map((slug) => GUIDE_PAGES.find((guidePage) => guidePage.slug === slug))
    .filter(Boolean)

  return `<section class="priority-guides" aria-labelledby="priority-guides-title">
  <div class="priority-guides-heading">
    <p class="eyebrow">Search Console priority fixes</p>
    <h2 id="priority-guides-title">Start with pages already getting impressions.</h2>
    <p>These guides target the error searches that are already appearing in Search Console. Open one, follow the repair path, then validate the fixed JSON.</p>
  </div>
  <div class="priority-guide-list">
    ${priorityGuides.map((guidePage) => `<a class="priority-guide-card" href="${guidePage.path}">
      <strong>${escapeHtml(guidePage.title)}</strong>
      <span>${escapeHtml(guidePage.summary)}</span>
    </a>`).join('\n    ')}
  </div>
</section>`
}

function renderGuideFixPath(page) {
  const steps = page.fixSteps?.length
    ? page.fixSteps
    : [
      'Read the parser message and go to the reported line and column.',
      'Check the highlighted character and the previous meaningful character for the smallest syntax mistake.',
      'Validate the complete document, then format it to confirm the repaired structure.',
    ]

  return `<section class="article-fix-path" aria-labelledby="fix-path-title">
  <div>
    <p class="eyebrow">Fast repair path</p>
    <h2 id="fix-path-title">Make the smallest correct edit.</h2>
    <p>Repair the first blocking syntax error before changing the rest of the payload.</p>
  </div>
  <ol>
    ${steps.map((step) => `<li>${escapeInlineCode(step)}</li>`).join('\n    ')}
  </ol>
  <div class="fix-path-actions">
    <a href="/json-error-finder/">Diagnose in JSON Error Finder</a>
    <a href="/json-validator/">Validate fixed JSON</a>
  </div>
</section>`
}

function renderGuideClusterLinks(page) {
  const group = GUIDE_GROUPS.find((guideGroup) => guideGroup.slugs.includes(page.slug))
  if (!group) return ''

  const clusterGuides = group.slugs
    .map((slug) => GUIDE_PAGES.find((guidePage) => guidePage.slug === slug))
    .filter((guidePage) => guidePage && guidePage.path !== page.path)
    .slice(0, 6)

  return `<section class="cluster-links" aria-labelledby="cluster-links-title">
  <div>
    <p class="eyebrow">Same search intent</p>
    <h2 id="cluster-links-title">More in this error cluster</h2>
    <p>${escapeHtml(group.summary)}</p>
  </div>
  <div class="cluster-link-list">
    ${clusterGuides.map((guidePage) => `<a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a>`).join('\n    ')}
  </div>
</section>`
}

function renderToolErrorCluster(page) {
  const guideSlugs = page.relatedGuideSlugs?.length
    ? page.relatedGuideSlugs
    : [
      'json-parse-error',
      'unexpected-token-in-json',
      'trailing-comma-in-json',
      'single-quotes-in-json',
    ]
  const clusterGuides = guideSlugs
    .map((slug) => GUIDE_PAGES.find((guidePage) => guidePage.slug === slug))
    .filter(Boolean)

  return `<section class="tool-error-cluster" aria-labelledby="tool-error-cluster-title">
  <div>
    <p class="eyebrow">Repair after diagnosis</p>
    <h2 id="tool-error-cluster-title">Common JSON errors</h2>
    <p>Jump from this tool to the guide that explains the parser message and the smallest practical fix.</p>
  </div>
  <div class="cluster-link-list">
    ${clusterGuides.map((guidePage) => `<a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a>`).join('\n    ')}
  </div>
</section>`
}

function renderAdPlaceholder(label) {
  return `<aside class="ad-placeholder" aria-label="${escapeHtml(label)}">
  <span>Ad placement reserved for future review</span>
</aside>`
}

function getStructuredData(page) {
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'JSONFmt',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.heading ?? page.title,
        item: page.canonical,
      },
    ],
  }

  if (page.kind === 'tool') {
    return [
      website,
      breadcrumb,
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: page.heading,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        url: page.canonical,
        description: page.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      },
    ]
  }

  if (page.kind !== 'guide') return [website, breadcrumb]

  return [
    website,
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.title,
      description: page.description,
      mainEntityOfPage: page.canonical,
      datePublished: today,
      dateModified: today,
      author: {
        '@type': 'Organization',
        name: 'JSON Formatter team',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    },
  ]
}

async function getBuiltCssLinks(distDir) {
  try {
    const assetsDir = path.join(distDir, 'assets')
    const files = await readdir(assetsDir)
    return files
      .filter((file) => file.endsWith('.css'))
      .map((file) => `/assets/${file}`)
  } catch {
    const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8').catch(() => '')
    return [...indexHtml.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((match) => match[1])
  }
}

async function getBuiltScriptLinks(distDir) {
  const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8').catch(() => '')
  return [...indexHtml.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g)].map((match) => match[1])
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeInlineCode(value) {
  const escaped = escapeHtml(value)
  return escaped.replaceAll(/`([^`]+)`/g, '<code>$1</code>')
}

function linkifyEmail(value) {
  return value.replaceAll(CONTACT_EMAIL, `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`)
}

function slugify(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '')
}

const runningDirectly = process.argv[1] && import.meta.url === pathToFileURL(fileURLToPath(import.meta.url)).href && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (runningDirectly) {
  await writeStaticPages()
}
