![Logo](./hyperlogo.png)

<h1 align="center" font="tradegothic">
  HYPER! 
</h1>

## Introduction

Hello there, and welcome to Hyper!, an exhilarating and quirky programming language designed for those who either want to express their limitless amount of energy or need stimulation while coding until late hours of the night. Inspired by HyperTalk and Python, Hyper! employs speech-like syntax for an easier, pragmatic experience.

Check out our [grammar](./grammar/hyper.ohm)!

Hyper! was devised by Breelyn Betts, Maya Dahlke, and Lexi Weingardt.

## Features

- Scripting Language <br />
- Statically typed <br />
- Higher Order Functions <br />

## Types and Variable Declaration

| Types      | Types in HYPER!           | Variable Declaration                                         |
| ---------- | ------------------------- | ------------------------------------------------------------ |
| int        | `INT`                     | `INT x IS 4!`                                                |
| float      | `FLT`                     | `FLT y IS 4.56!`                                             |
| string     | `STR`                     | `STR a IS "abc"!`                                            |
| boolean    | `BOO`                     | `BOO b IS TRUE!`                                             |
| array      | `ARR<Type>`               | `ARR<STR> c IS ["Hi", "I", "am", "hyper"]!`                  |
| tuple      | `TUP<Type>`               | `TUP<INT,FLT,STR> d IS (1, 2.5, "hello")!`                   |
| dictionary | `DICT<KeyType:ValueType>` | `DICT<INT:STR> e IS {1: "Hi", 2: "I", 3: "am", 4: "hyper"}!` |
| range      | `RANGE`                   | `RANGE(1, 5):`                                               |
| nonetype   | `LITERALLYNOTHING`        | `STR f IS LITERALLYNOTHING!`                                 |

## Operators

| Operation             | Operation in HYPER! | Variable Declaration       |
| --------------------- | ------------------- | -------------------------- |
| add                   | `ADD`               | `sum IS 3 ADD 10`          |
| subtract              | `SUB`               | `diff IS 5 SUB 2`          |
| multipy               | `MULT`              | `product IS 20 MULT 5`     |
| divide                | `DIV`               | `quotient IS 100 DIV 10`   |
| modulus               | `MOD`               | `modulus IS 101 MOD 2`     |
| strict equality       | `EQUALS`            | `3 EQUALS 3 MULT 1`        |
| less than             | `LESS`              | `5 LESS 10`                |
| greater than          | `GRT`               | `5 GRT 4`                  |
| less than or equal    | `LESSEQ`            | `num LESSEQ 0`             |
| greater than or equal | `GRTEQ`             | `num GRTEQ 0`              |
| logical and           | `AND`               | `num GRT 0 AND num LESS 5` |
| logical or            | `OR`                | `num GRT 0 OR num LESS 5`  |
| logical not           | `NOTEQ`             | `num NOTEQ 0`              |

## Control Flow

#### `if` statement

```
INT num IS 3!

TRY num GRT 0:
  SAY "Positive number"!
NO?TRY num EQUALS 0:
  SAY "Zero"!
NO???:
  SAY "Negative number"!
```

#### `for` loop

```
LOOKAT INT x IN ....(0, 10):
  SAY x!
```

#### `while` loop

```
UNTIL TRUE:
  SAY "I am hyper!"!
```

## Function Declaration

```
FUNC VOID helloWorld():
  SAY "Hello, world"!
```

## Comments

```
!!! this is a single line commment

!?
this is a
multi-line
comment
?!
```

## Static Semantic Errors

- Undeclared variables
- Mismatching types
- Incompatible types
- Breaking or continuing outside of a loop
- Not declaring a function before calling it
- Returning an incorrect function return type
- Returning a statement outside of a function
- Having return statements in a void function
- Declaring object methods with the same name
- Not declaring an object before initializing it
- Subscripting of non array and non tuple

## Example Programs

### Hello, World!

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
SAY "HELLO, WORLD!"!
```

  </td>
  <td>

```python
print('Hello, World!')
```

  </td>
  </tr>
</table>

### Fibonacci

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
FUNC INT fibonacci(INT num):
    TRY num EQUALS 0:
        GIMME 0!
    NO?TRY num EQUALS 1 OR num EQUALS 2:
        GIMME 1!
    GIMME fibonacci(num SUB 2) ADD fibonacci(num SUB 1)!
```

  </td>

  <td>

```python
def fibonacci(num):
    if num == 0:
        return 0
    if num == 1 or num == 2:
        return 1
    return fibonacci(num - 2) + fibonacci(num - 1)
```

  </td>

  </tr>
</table>

### Greatest Common Divisor

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
FUNC INT gcd(INT x, INT y):
    UNTIL y:
        x IS y!
        y IS x MOD y!
    GIMME x!

```

  </td>

  <td>

```python
def gcd(x, y):
    while(y):
        x, y = y, x % y
    return x
```

  </td>

  </tr>
</table>

### Finding the Largest of Three Numbers

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
INT num1 IS 10!
INT num2 IS 14!
INT num3 IS 12!
INT largest!

TRY (num1 GRTEQ num2) AND (num1 GRTEQ num3):
  largest IS num1!
NO?TRY (num2 GRTEQ num1) AND (num2 GRTEQ num3):
  largest IS num2!
NO???:
  largest IS num3!
SAY("The largest number is ", largest)!

```

  </td>

  <td>

```python
num1 = 10
num2 = 14
num3 = 12

if (num1 >= num2) and (num1 >= num3):
  largest = num1
elif (num2 >= num1) and (num2 >= num3):
  largest = num2
else:
  largest = num3

print("The largest number is", largest)
```

  </td>

  </tr>
</table>

### Multiplying Numbers in a Loop

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
INT num IS 12!

LOOKAT INT i IN RANGE(1, 11):
  SAY(num, "x", i, "=", num MULT i)!

```

  </td>

  <td>

```python
num = 12

for i in range(1, 11):
  print(num, 'x', i, '=', num*i)
```

  </td>

  </tr>
</table>

### Finding the Even Number

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
FUNC BOO isEven(INT num):
    GIMME num MOD 2 EQUALS 0!

```

  </td>

  <td>

```python
def is_even(num):
    return num % 2 == 0
```

  </td>

  </tr>
</table>

### Appending a String to an Array

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
ARR array IS ["Hi", "I'm", "Hyper"]!
array.push("LOL")!

SAY("element0: ", array[0])!

```

  </td>

  <td>

```python
List = ['Hi', 'I'm', 'Hyper']
List.append('LOL')

print "List[0]: ", List[0]
```

  </td>

  </tr>
</table>
