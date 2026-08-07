import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const SITE_URL = 'https://jsonfmt.org'
export const SITE_NAME = 'JSONFmt'
export const CONTACT_EMAIL = 'zhulinkaikai@gmail.com'

const today = '2026-08-07'

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
    title: 'Unexpected Token in JSON: How to Read and Fix the Error',
    description: 'Understand common unexpected token JSON parse errors, where to look first, and how to repair invalid JSON without guessing.',
    summary: 'Unexpected token errors are parser clues. The token is where parsing failed, not always where the original mistake started.',
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
        'An unexpected token error means the JSON parser reached a character that cannot legally appear at that position. The token might be a quote, brace, bracket, comma, letter, or the end of the input. The important detail is position: the parser is telling you where its expectations stopped matching the text.',
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
    faq: [
      ['What is an unexpected token in JSON?', 'It is a character the parser did not expect at that location according to strict JSON syntax.'],
      ['Is the highlighted token always the real mistake?', 'Not always. It is where parsing failed. The real mistake is often just before that position.'],
      ['How do I fix unexpected token errors quickly?', 'Check the highlighted line, then the previous line, for missing commas, extra commas, missing quotes, or mismatched braces.'],
    ],
  }),
  guide({
    slug: 'single-quotes-in-json',
    title: 'Single Quotes in JSON: Why They Are Invalid',
    description: 'JSON strings and property names must use double quotes. See invalid and fixed examples for single-quote JSON errors.',
    summary: 'Single quotes are common in JavaScript, Python, and examples online, but strict JSON requires double quotes.',
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
        'Single quotes are not valid string delimiters in standard JSON. Property names and string values must be wrapped in double quotes. If you paste `{\'name\': \'Ada\'}` into a strict JSON parser, it fails even though a JavaScript console may accept something similar as an object literal.',
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
  title: 'JSON Error Guides - Fix Common JSON Syntax Errors',
  description: 'Developer-focused guides for fixing trailing commas, unexpected tokens, single quotes, unquoted keys, unclosed strings, and comments in JSON.',
}

export const HOME_PAGE = {
  kind: 'home',
  path: '/',
  canonical: `${SITE_URL}/`,
  title: 'Fix Invalid JSON - JSON Formatter and Error Finder',
  description: 'Find and fix JSON syntax errors fast. Validate, format, minify, and copy JSON locally in your browser.',
}

export const PAGE_ROUTES = [
  HOME_PAGE,
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
  })[slug] ?? []
}

export function renderStaticPage(page, options = {}) {
  const cssLinks = options.cssLinks ?? []
  const jsonLd = getStructuredData(page)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <link rel="canonical" href="${page.canonical}">
    <meta property="og:type" content="${page.kind === 'guide' ? 'article' : 'website'}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${page.canonical}">
    <meta name="twitter:card" content="summary">
    ${cssLinks.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n    ')}
    ${jsonLd.map((data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`).join('\n    ')}
  </head>
  <body>
    <main class="static-shell">
      ${renderStaticHeader()}
      ${renderStaticBody(page)}
      ${renderStaticFooter()}
    </main>
  </body>
</html>
`
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

  for (const page of [GUIDES_INDEX, ...GUIDE_PAGES, ...TRUST_PAGES]) {
    const outputPath = path.join(distDir, page.path, 'index.html')
    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, renderStaticPage(page, { cssLinks }), 'utf8')
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
    <a href="/">Tool</a>
    <a href="/guides/">Guides</a>
    <a href="/about/">About</a>
    <a href="/contact/">Contact</a>
  </nav>
</header>`
}

function renderStaticFooter() {
  return `<footer class="static-footer">
  <span>JSON processed locally in your browser.</span>
  <nav aria-label="Footer navigation">
    <a href="/privacy/">Privacy Policy</a>
    <a href="/terms/">Terms of Use</a>
    <a href="/contact/">Contact</a>
  </nav>
</footer>`
}

function renderStaticBody(page) {
  if (page.kind === 'guides-index') return renderGuidesIndex()
  if (page.kind === 'guide') return renderGuidePage(page)
  return renderTrustPage(page)
}

function renderGuidesIndex() {
  return `<section class="static-hero">
  <p class="eyebrow">JSON error guides</p>
  <h1>Fix common JSON syntax errors.</h1>
  <p class="static-lead">Practical explanations for the errors developers hit most often when validating strict JSON.</p>
</section>
<section class="guide-card-grid" aria-label="JSON error guide list">
  ${GUIDE_PAGES.map((guidePage) => `<article class="guide-card">
    <p>${escapeHtml(guidePage.primaryKeyword)}</p>
    <h2><a href="${guidePage.path}">${escapeHtml(guidePage.title)}</a></h2>
    <span>${escapeHtml(guidePage.summary)}</span>
  </article>`).join('\n  ')}
</section>`
}

function renderGuidePage(page) {
  return `<article class="article-shell">
  <p class="eyebrow">JSON syntax guide</p>
  <h1>${escapeHtml(page.title)}</h1>
  <p class="static-lead">${escapeHtml(page.summary)}</p>
  <div class="article-cta top"><a href="/">Try it in JSON Error Finder</a></div>
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
  <div class="article-cta"><a href="/">Try it in JSON Error Finder</a></div>
</article>`
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

  if (page.kind !== 'guide') return [website]

  return [
    website,
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
