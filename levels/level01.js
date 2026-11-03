/* 
   LEVEL 1 – Basecamp: First Steps
   ---------------------------------------------------------
   Each lesson = a tutorial (pages of HTML) + a challenge.
   In tutorial HTML, any <pre class="r"> ... </pre> becomes a
   runnable example with "Run" and "Copy to editor" buttons.
   See README.md for every option.
    */
RQuest.registerLevel('level01', {
  intro: `
    <p>Welcome to basecamp, {name}! Before you can venture into the wilds of data, you need to learn the basics:
    how to talk to R, how to do maths, how to remember things with <b>variables</b>, the different <b>types</b> of data,
    and how to hold many values at once in a <b>vector</b>.</p>
    <p>Finish all seven lessons and beat the 👑 boss challenge to clear the level.</p>`,
  outro: '{name}, you can now print, calculate, store values in variables, tell data types apart and work with vectors. Vector Valley awaits!',

  lessons: [

    /* -------------------------------------------------- 1 */
    {
      id: 'l1-hello',
      title: 'Hello, R!',
      summary: 'Run your first line of R and print some text.',
      tutorial: [
        {
          title: 'Welcome to R, {name} 👋',
          body: `
            <p><b>R</b> is a programming language built for working with data. Scientists, analysts, journalists and
            esteemed Archeolgists use it to crunch numbers, run statistics and draw beautiful charts.</p>
            <p>On the right is your <b>code editor</b> (top) and the <b>console</b> (bottom):</p>
            <ul>
              <li>You write code in the <b>editor</b>.</li>
              <li>Press <b>▶ Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) and R runs it.</li>
              <li>Whatever R says back appears in the <b>console</b>.</li>
            </ul>
            <div class="callout tip"><b>Tip</b>Every tutorial has examples like the one below. Press <b>▶ Run example</b> to see what it does!</div>
            <pre class="r">print("Welcome to R Quest!")</pre>`,
        },
        {
          title: 'The print() function',
          body: `
            <p><code>print()</code> is a <b>function</b>: a named command that does a job. You put the thing you want
            it to work on inside the round brackets <code>( )</code>.</p>
            <pre class="r">print("I can talk to R")</pre>
            <p>Text in R is called a <b>string</b>, and it must always be wrapped in quotes. Double quotes
            <code>"like this"</code> or single quotes <code>'like this'</code> both work.</p>
            <pre class="r">print('Single quotes work too')</pre>
            <p>Each line of code is its own instruction. R runs them top to bottom:</p>
            <pre class="r">print("First")
print("Second")
print("Third")</pre>`,
        },
        {
          title: 'Watch out for these!',
          body: `
            <p>R is <b>case-sensitive</b>. <code>print</code> works, but <code>Print</code> or <code>PRINT</code> don't.</p>
            <pre class="r">Print("This will cause an error")</pre>
            <p>Forgetting the quotes also causes an error, because R thinks the words are names of things it should already know about:</p>
            <pre class="r">print(Hello)</pre>
            <div class="callout"><b>Errors are normal!</b>Every programmer sees errors all day. Read the red message, it usually tells you
            exactly what's wrong. The game also adds a 💡 tip underneath to help.</div>
            <p>You'll see <code>[1]</code> before R's answers. It just means "this is item number 1". You'll find out why when we meet vectors.</p>`,
        },
      ],
      challenge: {
        title: 'Send a signal from basecamp',
        brief: `<p>Your first job, {name}, is to radio the rest of the team. Write code that prints these two messages, <b>exactly</b> as shown, one after the other:</p>
                <ol><li><code>Hello, World!</code></li><li><code>I am learning R</code></li></ol>`,
        starter: '# Write your code below this line\n\n',
        solution: 'print("Hello, World!")\nprint("I am learning R")',
        xp: 100,
        hints: [
          'Use <code>print()</code> with the text inside the brackets.',
          'Text needs quotes: <pre>print("Hello, World!")</pre>',
          'You need two separate lines, one <code>print()</code> for each message. Check capital letters and punctuation carefully.',
        ],
        checks: [
          { type: 'output', match: /Hello, World!/, label: 'Print <code>Hello, World!</code>',
            fail: 'I couldn\'t see <code>Hello, World!</code> in the output. Check the capital letters, the comma and the exclamation mark.' },
          { type: 'output', match: /I am learning R/, label: 'Print <code>I am learning R</code>',
            fail: 'I couldn\'t see <code>I am learning R</code> in the output.' },
          { type: 'code', match: /print\s*\(/, label: 'Use the <code>print()</code> function',
            fail: 'Use the <code>print()</code> function to display your messages.' },
        ],
        success: '<p>Signal received, {name}! You just wrote and ran real R code.</p>',
      },
    },

    /* -------------------------------------------------- 2 */
    {
      id: 'l1-calc',
      title: 'R as a Calculator',
      summary: 'Arithmetic operators and the order of operations.',
      tutorial: [
        {
          title: 'Doing maths',
          body: `
            <p>At its heart, R is a very powerful calculator. Type a sum and R gives you the answer:</p>
            <pre class="r">2 + 3</pre>
            <p>Notice there's no <code>print()</code>. When a line just <i>is</i> a value, R prints it automatically.</p>
            <p>Here are the basic <b>operators</b>:</p>
            <ul>
              <li><code>+</code> add &nbsp; <code>-</code> subtract</li>
              <li><code>*</code> multiply &nbsp; <code>/</code> divide</li>
              <li><code>^</code> to the power of</li>
            </ul>
            <pre class="r">10 - 4
6 * 7
22 / 7
2 ^ 8</pre>`,
        },
        {
          title: 'Order of operations',
          body: `
            <p>R follows the same rules as maths class (BODMAS / PEMDAS (PEDMAS is weird tho)): powers first, then multiply and divide, then add and subtract.</p>
            <pre class="r">2 + 3 * 4</pre>
            <p>That gives 14, not 20! Use brackets to control the order:</p>
            <pre class="r">(2 + 3) * 4</pre>
            <div class="callout tip"><b>Tip</b>Spaces around operators don't change anything (<code>2+3</code> works too), but they make your code much easier to read.</div>`,
        },
        {
          title: 'Two bonus operators',
          body: `
            <p>Sometimes you want whole-number division:</p>
            <ul>
              <li><code>%/%</code> integer division: how many whole times does it fit?</li>
              <li><code>%%</code> remainder (called <i>modulo</i>): what's left over?</li>
            </ul>
            <pre class="r">17 %/% 5
17 %% 5</pre>
            <p>17 ÷ 5 is 3 with 2 left over. The remainder operator is handy later, for example to check whether a number is even (<code>x %% 2</code> is 0).</p>`,
        },
      ],
      challenge: {
        title: 'Plan the supplies',
        brief: `<p>The quartermaster needs some numbers. Write R code that calculates each of these. Write the actual sums, not just the answers:</p>
                <ol>
                  <li>The number of hours in a year</li>
                  <li>The number of combinations on a 10-switch panel: <b>you will need to use the power operator here</b></li>
                  <li>The average of 12 mini rolls and 18 chocolate buttons over 5 days: <b>use bodmas here</b></li>
                </ol>`,
        starter: '# 1. Hours in a year\n\n\n# 2. Combinations\n\n\n# 3. (12 plus 18) divided by 5\n\n',
        solution: '# 1. Hours in a year\n365 * 24\n\n# 2. Combinations\n2 ^ 10\n\n# 3. (12 plus 18) divided by 5\n(12 + 18) / 5',
        xp: 100,
        hints: [
          'Multiply with <code>*</code> and raise to a power with <code>^</code>.',
          'For number 3, R would do the division first unless you use brackets around the addition.',
          'The third one looks like: <pre>(12 + 18) / 5</pre>',
        ],
        checks: [
          { type: 'output', match: /\b8760\b/, label: 'Calculate the hours in a year',
            fail: 'I couldn\'t find the hours in a year (365 × 24) in the output.' },
          { type: 'code', match: /365\s*\*\s*24|24\s*\*\s*365/,
            fail: 'Write the sum for the hours in a year using <code>*</code>, not just the answer.' },
          { type: 'output', match: /\b1024\b/, label: 'Calculate 2 to the power of 10',
            fail: 'I couldn\'t find 2 to the power of 10 in the output.' },
          { type: 'code', match: /2\s*\^\s*10/,
            fail: 'Use the <code>^</code> operator for the power: <code>2 ^ 10</code>.' },
          { type: 'output', match: /^\[1\] 6$/m, label: 'Calculate (12 + 18) ÷ 5',
            fail: 'The third answer should be 6. Did you use brackets so the addition happens first?' },
          { type: 'code', match: /\(\s*12\s*\+\s*18\s*\)\s*\/\s*5/,
            fail: 'Write the third sum with brackets: <code>(12 + 18) / 5</code>.' },
        ],
        success: '<p>The quartermaster is impressed, {name}. You can now use R for any calculation.</p>',
      },
    },

    /* -------------------------------------------------- 3 */
    {
      id: 'l1-comments',
      title: 'Leaving Notes: Comments',
      summary: 'Use # to write notes that R ignores.',
      tutorial: [
        {
          title: 'What is a comment?',
          body: `
            <p>Anything after a <code>#</code> on a line is a <b>comment</b>. R completely ignores it. Comments are notes for humans: for you in the future, or for anyone else reading your code.</p>
            <pre class="r"># This line is ignored by R
print("This line runs")   # comments can go at the end of a line too</pre>
            <p>Good comments explain <i>why</i> you're doing something, not just <i>what</i>:</p>
            <pre class="r"># Convert the distance from miles to kilometres
26.2 * 1.609</pre>`,
        },
        {
          title: 'Commenting out code',
          body: `
            <p>Comments are also handy for switching off a line without deleting it. This is called <b>commenting out</b>:</p>
            <pre class="r">print("Line one")
# print("This line is switched off")
print("Line three")</pre>
            <div class="callout tip"><b>Shortcut</b>In the editor, put your cursor on a line (or select several) and press <kbd>Ctrl</kbd>+<kbd>/</kbd> to comment or uncomment them.</div>
            <p>If you forget the <code>#</code> on a note, R tries to run it as code and you'll get an error. That's exactly what's happened in this lesson's challenge…</p>`,
        },
      ],
      challenge: {
        title: 'Fix the mission log',
        brief: `<p>A teammate wrote the mission log below, but forgot to mark one of their notes as a comment, so the script crashes. Press <b>▶ Run</b> to see the error, then:</p>
                <ol>
                  <li>Turn the broken note into a comment so the script runs.</li>
                  <li>Add a new line at the end that prints <code>Day 3: Wrote my first comment</code></li>
                  <li>Add at least one comment of your own explaining something.</li>
                </ol>`,
        starter: '# Mission log\nprint("Day 1: Arrived at basecamp")\nthis line is a note but R thinks it is code\nprint("Day 2: Learned about comments")\n',
        solution: '# Mission log\nprint("Day 1: Arrived at basecamp")\n# this line is a note but R thinks it is code\nprint("Day 2: Learned about comments")\n# My own note: day 3 is today\nprint("Day 3: Wrote my first comment")\n',
        xp: 100,
        hints: [
          'Put a <code>#</code> at the start of the line that says <i>this line is a note…</i>',
          'Your own comment can say anything, as long as the line starts with <code>#</code>.',
          'The new line is just: <pre>print("Day 3: Wrote my first comment")</pre>',
        ],
        checks: [
          { type: 'code', match: /#\s*this line is a note/, raw: true, label: 'Turn the broken note into a comment',
            fail: 'The note <i>this line is a note…</i> should start with <code>#</code>.' },
          { type: 'output', match: /Day 1: Arrived at basecamp[\s\S]*Day 2: Learned about comments/, label: 'Keep the Day 1 and Day 2 messages working',
            fail: 'The Day 1 and Day 2 messages should still be printed.' },
          { type: 'output', match: /Day 3: Wrote my first comment/, label: 'Print <code>Day 3: Wrote my first comment</code>',
            fail: 'Add a line that prints <code>Day 3: Wrote my first comment</code>.' },
          { type: 'code', match: /#[^\n]*\n[\s\S]*#[^\n]*\n?[\s\S]*#/, raw: true, label: 'Add a comment of your own',
            fail: 'Add at least one new comment of your own (a line starting with <code>#</code>).' },
        ],
        success: '<p>The log runs perfectly, {name}. Remember: good comments make code easy to understand later.</p>',
      },
    },

    /* -------------------------------------------------- 4 */
    {
      id: 'l1-variables',
      title: 'Variables: Storing Values',
      summary: 'Save values with <- and use them later.',
      tutorial: [
        {
          title: 'Giving values a name',
          body: `
            <p>A <b>variable</b> is a name that stores a value so you can use it later. You create one with the
            <b>assignment arrow</b> <code>&lt;-</code> (a less-than sign followed by a minus sign):</p>
            <pre class="r">camp_height <- 1250
camp_height</pre>
            <p>Read <code>camp_height &lt;- 1250</code> as <i>"camp_height gets 1250"</i>. Notice that creating the variable doesn't print anything. Typing its name on its own line shows its value.</p>
            <div class="callout tip"><b>Shortcut</b>Press <kbd>Alt</kbd>+<kbd>-</kbd> in the editor to type <code>&lt;-</code> instantly (the same shortcut as in RStudio).</div>
            <p>Variables can hold text too:</p>
            <pre class="r">leader <- "Captain Mordubh"
print(leader)</pre>`,
        },
        {
          title: 'Naming rules',
          body: `
            <p>Variable names:</p>
            <ul>
              <li>can contain letters, numbers, <code>_</code> and <code>.</code></li>
              <li>must <b>start with a letter</b> (<code>day2</code> ✔, <code>2day</code> ✘)</li>
              <li>can't contain spaces (<code>my name</code> ✘), so use <code>my_name</code> instead</li>
              <li>are <b>case-sensitive</b>: <code>Score</code> and <code>score</code> are different variables</li>
            </ul>
            <p>Most R programmers use <b>snake_case</b>: lowercase words joined by underscores, like <code>total_distance</code>.</p>
            <div class="callout"><b>What about = ?</b>You'll sometimes see <code>x = 5</code>. It works too, but <code>&lt;-</code> is the standard R style, so that's what we'll use.</div>`,
        },
        {
          title: 'Changing a variable',
          body: `
            <p>Assigning to a name that already exists <b>replaces</b> the old value:</p>
            <pre class="r">water_litres <- 10
water_litres <- 8
water_litres</pre>
            <p>You can even use a variable's current value to work out its new value. R works out the right-hand side first, then stores the result:</p>
            <pre class="r">water_litres <- 10
water_litres <- water_litres - 3   # drank 3 litres
water_litres</pre>
            <p>This "update a variable using itself" pattern is everywhere in programming, for counters, scores and running totals.</p>`,
        },
      ],
      challenge: {
        title: 'Fill in your explorer profile',
        brief: `<p>Register yourself at basecamp, {name}, by creating some variables:</p>
                <ol>
                  <li>A variable called <code>explorer</code> containing your name as text: <code>"{name}"</code></li>
                  <li>A variable called <code>age</code> containing a number.</li>
                  <li>A variable called <code>backpack_kg</code> that starts at <code>12.5</code>.</li>
                  <li>You've just packed a 2.5 kg tent. <b>Update</b> <code>backpack_kg</code> by adding <code>2.5</code> to itself.</li>
                  <li>Print <code>backpack_kg</code>.</li>
                </ol>`,
        starter: '# Create your variables here\n\n',
        solution: 'explorer <- "{name}"\nage <- 25\nbackpack_kg <- 12.5\nbackpack_kg <- backpack_kg + 2.5\nprint(backpack_kg)',
        xp: 100,
        hints: [
          'Create a variable like this: <pre>age <- 25</pre>',
          'Text needs quotes, numbers don\'t: <code>explorer &lt;- "{name}"</code>',
          'To add to a variable, use it on both sides: <pre>backpack_kg <- backpack_kg + 2.5</pre>',
        ],
        checks: [
          { type: 'r', test: '.has("explorer") && is.character(explorer) && nchar(explorer[1]) > 0',
            label: 'Create <code>explorer</code> containing your name as text',
            fail: '<code>explorer</code> should exist and contain text in quotes, e.g. <code>explorer &lt;- "{name}"</code>.' },
          { type: 'r', test: '.has("age") && is.numeric(age)', label: 'Create <code>age</code> containing a number',
            fail: '<code>age</code> should exist and be a number (no quotes!).' },
          { type: 'r', test: '.has("backpack_kg") && .near(backpack_kg, 15)', label: '<code>backpack_kg</code> starts at 12.5 and ends at 15',
            fail: '<code>backpack_kg</code> should end up as 15 (12.5 + 2.5).' },
          { type: 'code', match: /backpack_kg\s*<-\s*12\.5/,
            fail: 'Start with <code>backpack_kg &lt;- 12.5</code>.' },
          { type: 'code', match: /backpack_kg\s*<-\s*backpack_kg\s*\+\s*2\.5|backpack_kg\s*<-\s*2\.5\s*\+\s*backpack_kg/,
            label: 'Update <code>backpack_kg</code> using itself',
            fail: 'Update the variable using its own value: <code>backpack_kg &lt;- backpack_kg + 2.5</code>.' },
          { type: 'output', match: /\[1\] 15\b/, label: 'Print <code>backpack_kg</code>',
            fail: 'Print <code>backpack_kg</code> at the end so we can see it\'s 15.' },
        ],
        success: '<p>Profile registered. Welcome aboard, {name}! Variables are the building blocks of every program you\'ll write.</p>',
      },
    },

    /* -------------------------------------------------- 5 */
    {
      id: 'l1-var-maths',
      title: 'Calculating with Variables',
      summary: 'Combine variables in calculations and store the results.',
      tutorial: [
        {
          title: 'Variables in sums',
          body: `
            <p>Once a value has a name, you can use the name anywhere you'd use the value:</p>
            <pre class="r">width <- 4
length <- 6
width * length</pre>
            <p>Even better, store the result in a new variable so you can use it again:</p>
            <pre class="r">width <- 4
length <- 6
area <- width * length
area
area * 2</pre>
            <p>Using names instead of raw numbers makes code readable. <code>area &lt;- width * length</code> explains itself. <code>24</code> on its own doesn't!</p>`,
        },
        {
          title: 'Variables don\'t update by themselves',
          body: `
            <p>Although I don\'t know much about R, this surprises a lot of beginner coders. A variable stores the <b>result</b> of a calculation at the moment it runs, not the formula:</p>
            <pre class="r">a <- 2
b <- a * 10
a <- 5
b</pre>
            <p><code>b</code> is still <code>20</code>! It was calculated when <code>a</code> was 2. Changing <code>a</code> afterwards doesn't change <code>b</code>. (Spreadsheets work differently, which is why this catches people out.)</p>
            <div class="callout tip"><b>Tip</b>If you change an input, re-run the lines that use it. That's one reason we run whole scripts from top to bottom.</div>`,
        },
      ],
      challenge: {
        title: 'Work out the expedition budget',
        brief: `<p>The starter code already has the prices. Use the variables (don't type the answers yourself!) to create:</p>
                <ol>
                  <li><code>tents_cost</code>: the number of tents times the price of a tent</li>
                  <li><code>food_cost</code>: the number of days times the food cost per day</li>
                  <li><code>total_cost</code>: the tents cost plus the food cost</li>
                </ol>
                <p>Then print <code>total_cost</code>.</p>`,
        starter: 'tents <- 3\ntent_price <- 45\nfood_days <- 7\nfood_per_day <- 12.5\n\n# Your calculations below\n\n',
        solution: 'tents <- 3\ntent_price <- 45\nfood_days <- 7\nfood_per_day <- 12.5\n\n# Your calculations below\ntents_cost <- tents * tent_price\nfood_cost <- food_days * food_per_day\ntotal_cost <- tents_cost + food_cost\nprint(total_cost)',
        xp: 100,
        hints: [
          'Multiply two variables just like numbers: <code>tents * tent_price</code>',
          'Store each result with <code>&lt;-</code>, e.g. <pre>tents_cost <- tents * tent_price</pre>',
          'The total adds your two new variables: <pre>total_cost <- tents_cost + food_cost</pre>',
        ],
        checks: [
          { type: 'r', test: '.has("tents_cost") && .near(tents_cost, tents * tent_price)', label: 'Create <code>tents_cost</code>',
            fail: '<code>tents_cost</code> should be <code>tents * tent_price</code>.' },
          { type: 'r', test: '.has("food_cost") && .near(food_cost, food_days * food_per_day)', label: 'Create <code>food_cost</code>',
            fail: '<code>food_cost</code> should be <code>food_days * food_per_day</code>.' },
          { type: 'r', test: '.has("total_cost") && .near(total_cost, tents_cost + food_cost)', label: 'Create <code>total_cost</code>',
            fail: '<code>total_cost</code> should add <code>tents_cost</code> and <code>food_cost</code>.' },
          { type: 'code', match: /total_cost\s*<-[^\n]*(tents_cost|food_cost)/,
            fail: 'Work out <code>total_cost</code> from your other variables, not typed-in numbers.' },
          { type: 'notcode', match: /\b(135|87\.5|222\.5)\b/,
            fail: 'Don\'t type the answers in yourself. Let R calculate them from the variables.' },
          { type: 'output', match: /222\.5/, label: 'Print <code>total_cost</code>',
            fail: 'Print <code>total_cost</code> at the end.' },
        ],
        success: '<p>Budget approved, {name}! Try changing <code>tents</code> to 4 and re-running. Everything updates because you used variables.</p>',
      },
    },

    /* -------------------------------------------------- 6 */
    {
      id: 'l1-types',
      title: 'Types of Data',
      summary: 'Numbers, text and TRUE/FALSE, and how to check them with class().',
      tutorial: [
        {
          title: 'The three basic types',
          body: `
            <p>Every value in R has a <b>type</b>. The three you'll use most are:</p>
            <ul>
              <li><b>numeric</b>: numbers, whole or decimal: <code>42</code>, <code>-3.5</code></li>
              <li><b>character</b>: text in quotes: <code>"hello"</code></li>
              <li><b>logical</b>: <code>TRUE</code> or <code>FALSE</code> (all capitals, no quotes)</li>
            </ul>
            <p>The <code>class()</code> function tells you the type of any value:</p>
            <pre class="r">class(42)
class("hello")
class(TRUE)</pre>`,
        },
        {
          title: '"5" is not 5',
          body: `
            <p>Quotes turn anything into text, even numbers. Text can't be used in maths:</p>
            <pre class="r">class(5)
class("5")
"5" + 1</pre>
            <p>That error, <i>non-numeric argument to binary operator</i>, almost always means you're doing maths with text. You can convert text to a number with <code>as.numeric()</code>:</p>
            <pre class="r">as.numeric("5") + 1</pre>`,
        },
        {
          title: 'Comparisons give TRUE or FALSE',
          body: `
            <p>Logical values usually come from <b>comparisons</b>:</p>
            <ul>
              <li><code>&gt;</code> greater than, <code>&lt;</code> less than</li>
              <li><code>&gt;=</code> at least, <code>&lt;=</code> at most</li>
              <li><code>==</code> equal to (two equals signs!), <code>!=</code> not equal to (!=)</li>
            </ul>
            <pre class="r">altitude <- 1250
altitude > 1000
altitude == 500
"tent" != "torch"</pre>
            <p>You can store the result of a comparison in a variable, just like any other value:</p>
            <pre class="r">altitude <- 1250
is_high <- altitude > 1000
is_high
class(is_high)</pre>
            <div class="callout warn"><b>Careful</b>One <code>=</code> is for assigning, two <code>==</code> is for comparing. Mixing them up is one of the most common bugs.</div>`,
        },
      ],
      challenge: {
        title: 'Weather station report',
        brief: `<p>Set up the basecamp weather station:</p>
                <ol>
                  <li>Create <code>temperature</code> with the value <code>-3.5</code></li>
                  <li>Create <code>weather</code> with the text <code>"snowy"</code></li>
                  <li>Create <code>is_cold</code> by <b>comparing</b> whether <code>temperature</code> is less than <code>0</code> (don't just type TRUE!)</li>
                  <li>Print the class of <code>weather</code>, then the class of <code>is_cold</code></li>
                </ol>`,
        starter: '# Weather station\n\n',
        solution: '# Weather station\ntemperature <- -3.5\nweather <- "snowy"\nis_cold <- temperature < 0\nprint(class(weather))\nprint(class(is_cold))',
        xp: 100,
        hints: [
          'A negative number is written with a minus sign: <code>temperature &lt;- -3.5</code>',
          'A comparison gives TRUE or FALSE, so store it: <pre>is_cold <- temperature < 0</pre>',
          'Put one function inside another: <pre>print(class(weather))</pre>',
        ],
        checks: [
          { type: 'r', test: '.has("temperature") && is.numeric(temperature) && .near(temperature, -3.5)', label: '<code>temperature</code> is -3.5',
            fail: '<code>temperature</code> should be the number <code>-3.5</code> (no quotes).' },
          { type: 'r', test: '.has("weather") && identical(weather, "snowy")', label: '<code>weather</code> is "snowy"',
            fail: '<code>weather</code> should be the text <code>"snowy"</code>, all lowercase, in quotes.' },
          { type: 'r', test: '.has("is_cold") && identical(is_cold, TRUE)', label: '<code>is_cold</code> is TRUE',
            fail: '<code>is_cold</code> should be <code>TRUE</code>.' },
          { type: 'code', match: /is_cold\s*<-\s*(temperature\s*<\s*0|0\s*>\s*temperature)/, label: 'Work out <code>is_cold</code> with a comparison',
            fail: 'Work out <code>is_cold</code> using a comparison: <code>temperature &lt; 0</code>.' },
          { type: 'output', match: /"character"[\s\S]*"logical"/, label: 'Print the classes of <code>weather</code> and <code>is_cold</code>',
            fail: 'Print <code>class(weather)</code> and then <code>class(is_cold)</code>.' },
        ],
        success: '<p>Station online, {name}. Knowing a value\'s type helps you understand (and fix) most errors.</p>',
      },
    },

    /* -------------------------------------------------- 7 */
    {
      id: 'l1-vectors',
      title: 'Vectors: Many Values at Once',
      summary: 'Combine values with c() and summarise them with sum(), mean() and friends.',
      tutorial: [
        {
          title: 'Combining values with c()',
          body: `
            <p>So far each variable has held one value. A <b>vector</b> holds many values in order. Make one with
            <code>c()</code>, short for <i>combine</i>:</p>
            <pre class="r">heights <- c(1250, 1400, 1875, 2100)
heights</pre>
            <p>Vectors can hold text or logicals too, but every item in a vector must be the <b>same type</b>:</p>
            <pre class="r">team <- c("Ada", "Grace", "Alan")
team
length(team)</pre>
            <p><code>length()</code> tells you how many items are in a vector. Now you know what <code>[1]</code> means: it's the position of the first value on that line!</p>`,
        },
        {
          title: 'Summarising a vector',
          body: `
            <p>R has lots of functions that summarise a whole vector at once:</p>
            <pre class="r">scores <- c(7, 3, 9, 5, 6)
sum(scores)
mean(scores)
max(scores)
min(scores)</pre>
            <p>You can store these results in variables like any other value:</p>
            <pre class="r">scores <- c(7, 3, 9, 5, 6)
best <- max(scores)
best</pre>`,
        },
        {
          title: 'Maths on every item',
          body: `
            <p>Here's one of R's superpowers. Do maths with a vector and R applies it to <b>every item</b> automatically:</p>
            <pre class="r">prices <- c(10, 20, 35)
prices * 2
prices + 1</pre>
            <p>This is called <b>vectorisation</b>. In many other languages you'd need a loop. In R it's one line. This makes R kinda cool imo:</p>
            <pre class="r">celsius <- c(-5, 0, 12, 25)
fahrenheit <- celsius * 9 / 5 + 32
fahrenheit</pre>`,
        },
      ],
      challenge: {
        title: 'Log the hiking distances',
        brief: `<p>This week the team hiked <b>12, 8, 15, 10 and 9</b> kilometres. Create:</p>
                <ol>
                  <li><code>hikes</code>: a vector of those five distances, in that order</li>
                  <li><code>total_km</code>: the total distance (use a function!)</li>
                  <li><code>average_km</code>: the mean distance</li>
                  <li><code>longest</code>: the longest hike</li>
                  <li><code>miles</code>: every distance converted to miles by multiplying <code>hikes</code> by <code>0.621</code></li>
                </ol>
                <p>Finally, print <code>average_km</code>.</p>`,
        starter: '# Hiking log\n\n',
        solution: '# Hiking log\nhikes <- c(12, 8, 15, 10, 9)\ntotal_km <- sum(hikes)\naverage_km <- mean(hikes)\nlongest <- max(hikes)\nmiles <- hikes * 0.621\nprint(average_km)',
        xp: 100,
        hints: [
          'Build the vector with <code>c()</code> and commas: <pre>hikes <- c(12, 8, 15, 10, 9)</pre>',
          'Use <code>sum()</code>, <code>mean()</code> and <code>max()</code> on <code>hikes</code>.',
          'Multiply the whole vector in one go: <pre>miles <- hikes * 0.621</pre>',
        ],
        checks: [
          { type: 'r', test: '.has("hikes") && is.numeric(hikes) && isTRUE(all.equal(as.numeric(hikes), c(12, 8, 15, 10, 9)))',
            label: 'Create the <code>hikes</code> vector', fail: '<code>hikes</code> should be <code>c(12, 8, 15, 10, 9)</code>, in that order.' },
          { type: 'r', test: '.has("total_km") && .near(total_km, 54)', label: '<code>total_km</code> is the total',
            fail: '<code>total_km</code> should be the sum of <code>hikes</code>.' },
          { type: 'r', test: '.has("average_km") && .near(average_km, 10.8)', label: '<code>average_km</code> is the mean',
            fail: '<code>average_km</code> should be the mean of <code>hikes</code>.' },
          { type: 'r', test: '.has("longest") && .near(longest, 15)', label: '<code>longest</code> is the maximum',
            fail: '<code>longest</code> should be the largest value in <code>hikes</code>.' },
          { type: 'r', test: '.has("miles") && length(miles) == 5 && .near(miles, c(12, 8, 15, 10, 9) * 0.621)',
            label: '<code>miles</code> converts every distance', fail: '<code>miles</code> should be <code>hikes * 0.621</code> (five values).' },
          { type: 'code', match: /sum\s*\(/, fail: 'Use the <code>sum()</code> function for the total.' },
          { type: 'code', match: /mean\s*\(/, fail: 'Use the <code>mean()</code> function for the average.' },
          { type: 'code', match: /max\s*\(/, fail: 'Use the <code>max()</code> function for the longest hike.' },
          { type: 'output', match: /10\.8/, label: 'Print <code>average_km</code>', fail: 'Print <code>average_km</code> at the end.' },
        ],
        success: '<p>Log complete, {name}. Vectors are at the heart of R. Almost everything you do will use them.</p>',
      },
    },

    /* -------------------------------------------------- BOSS */
    {
      id: 'l1-boss',
      title: 'Boss: The Basecamp Report',
      summary: 'Put everything from this level together.',
      boss: true,
      tutorial: [
        {
          title: '👑 Boss challenge',
          body: `
            <p>Time to prove you've mastered basecamp, {name}! The boss challenge doesn't teach anything new. It mixes together everything you've learned:</p>
            <ul>
              <li><code>print()</code> and text in quotes</li>
              <li>Arithmetic operators: <code>+ - * / ^</code></li>
              <li>Comments with <code>#</code></li>
              <li>Variables with <code>&lt;-</code></li>
              <li>Types: numeric, character, logical, and comparisons like <code>&gt;</code></li>
              <li>Vectors with <code>c()</code>, plus <code>length()</code>, <code>sum()</code>, <code>mean()</code>, <code>max()</code></li>
            </ul>
            <p>Here's a quick refresher that uses most of them:</p>
            <pre class="r"># Snacks for the trip
snacks <- c("apple", "nuts", "chocolate")
calories <- c(95, 180, 230)
length(snacks)
total <- sum(calories)
total > 500</pre>
            <div class="callout tip"><b>Tip</b>Run your code often as you build it up, one step at a time. You don't have to get it all right in one go.</div>`,
        },
      ],
      challenge: {
        title: 'Pack for the expedition',
        brief: `<p>Before leaving basecamp, write a script that checks the team's pack:</p>
                <ol>
                  <li>Create <code>supplies</code>: a vector of the text values <code>"rope"</code>, <code>"torch"</code>, <code>"map"</code> and <code>"compass"</code></li>
                  <li>Create <code>weights</code>: their weights in kg: <code>2.5</code>, <code>0.8</code>, <code>0.2</code>, <code>0.3</code></li>
                  <li>Create <code>n_items</code>: the number of supplies (use a function)</li>
                  <li>Create <code>total_weight</code>: the total of <code>weights</code></li>
                  <li>Create <code>too_heavy</code>: whether <code>total_weight</code> is greater than <code>5</code></li>
                  <li>Print <code>n_items</code>, <code>total_weight</code> and <code>too_heavy</code></li>
                  <li>Include at least one comment</li>
                </ol>`,
        starter: '',
        solution: '# Expedition pack check\nsupplies <- c("rope", "torch", "map", "compass")\nweights <- c(2.5, 0.8, 0.2, 0.3)\n\nn_items <- length(supplies)\ntotal_weight <- sum(weights)\ntoo_heavy <- total_weight > 5\n\nprint(n_items)\nprint(total_weight)\nprint(too_heavy)',
        xp: 250,
        hints: [
          'Text vectors need quotes around each item: <code>c("rope", "torch", …)</code>',
          '<code>length()</code> counts items and <code>sum()</code> adds them up.',
          '<code>too_heavy</code> is a comparison: <pre>too_heavy <- total_weight > 5</pre>',
        ],
        checks: [
          { type: 'r', test: '.has("supplies") && identical(supplies, c("rope", "torch", "map", "compass"))',
            label: 'Create the <code>supplies</code> vector', fail: '<code>supplies</code> should be <code>c("rope", "torch", "map", "compass")</code>.' },
          { type: 'r', test: '.has("weights") && is.numeric(weights) && .near(weights, c(2.5, 0.8, 0.2, 0.3))',
            label: 'Create the <code>weights</code> vector', fail: '<code>weights</code> should be <code>c(2.5, 0.8, 0.2, 0.3)</code>.' },
          { type: 'r', test: '.has("n_items") && .near(n_items, 4)', label: '<code>n_items</code> counts the supplies',
            fail: '<code>n_items</code> should be the number of supplies (4).' },
          { type: 'code', match: /n_items\s*<-\s*length\s*\(\s*supplies\s*\)/, fail: 'Use <code>length(supplies)</code> to work out <code>n_items</code>.' },
          { type: 'r', test: '.has("total_weight") && .near(total_weight, 3.8)', label: '<code>total_weight</code> adds up the weights',
            fail: '<code>total_weight</code> should be the sum of <code>weights</code>.' },
          { type: 'code', match: /total_weight\s*<-\s*sum\s*\(\s*weights\s*\)/, fail: 'Use <code>sum(weights)</code> to work out <code>total_weight</code>.' },
          { type: 'r', test: '.has("too_heavy") && identical(too_heavy, FALSE)', label: '<code>too_heavy</code> compares the total with 5',
            fail: '<code>too_heavy</code> should be the comparison <code>total_weight &gt; 5</code> (which is FALSE).' },
          { type: 'code', match: /too_heavy\s*<-\s*(total_weight\s*>\s*5|5\s*<\s*total_weight)/, fail: 'Work out <code>too_heavy</code> with a comparison, not by typing FALSE.' },
          { type: 'output', match: /\[1\] 4\b[\s\S]*\[1\] 3\.8\b[\s\S]*\[1\] FALSE/, label: 'Print the three results in order',
            fail: 'Print <code>n_items</code>, then <code>total_weight</code>, then <code>too_heavy</code>.' },
          { type: 'code', match: /#/, raw: true, label: 'Include a comment', fail: 'Add at least one comment starting with <code>#</code>.' },
        ],
        success: '<p>The pack is light enough. <b>Level complete, {name}!</b></p>',
      },
    },
  ],
});
