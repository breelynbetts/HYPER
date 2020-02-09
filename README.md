# HYPER!

![Logo](./hyper.jpg)


## Introduction

Hello there, and welcome to Hyper!, an exhilarating and quirky programming language designed for those who either want to express their limitless amount of energy or need stimulation while coding until late hours of the night. Inspired by HyperTalk and Python, Hyper! employs speech-like syntax and class-based inheritance for an easier, pragmatic experience.

Hyper! was devised by Breelyn Betts, Maya Dahlke, and Lexi Weingardt.

## Features

- Scripting Language <br />
- Class based inheritance <br />
- Strongly typed <br />
- Statically typed <br />
- Higher Order Functions <br />

## Types

- int: INT <br />
- float: FLT <br />
- string: STR <br />
- boolean: BOO <br />
- array: ARR <br />
- tuple: TUP <br />
- nonetype: LITERALLYNOTHING <br />

## Variable Declaration

```
INT x IS 2!

FLT y IS 3.56!

STR a IS "abc"!

BOO b IS TRUE!

ARR c IS ["Hi", "I", "am", "hyper"]!

TUP d IS (1, 2.5, "hello")!
```

## Operators

- add: `ADD` <br />
- subtract: `SUB` <br />
- multiply: `MULT` <br />
- divide: `DIV` <br /> 
- modulus: `MOD` <br />
- strict equality: `EQUALS` <br />
- less than: `LESS` <br />
- greater than: `GRT` <br />
- less than or equal: `LESSEQ` <br />
- greater than or equal: `GRTEQ` <br />
- logical and: `AND` <br />
- logical or: `OR` <br />
- logical not: `NOTEQ` <br />

## Conditional

```
INT num IS 3!

TRY num GRT 0:
  SAY("Positive number")!
NO?TRY num EQUALS 0:
  SAY("Zero")!
NO???:
  SAY("Negative number")!
```

## Loops

```
INT x!

LOOKAT x IN range(0, 10):
  SAY(x)!

```

```
UNTIL TRUE:
  SAY("I am hyper!")!
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
- Using lowercase on keywords
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
    UNTIL(y):
        x, y = y, x MOD y!
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
 
SAY("The largest number is", largest)!

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

### Multiplying a Numbers in a Loop

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
INT num IS 12!

LOOKAT INT i IN range(1, 11):
  SAY(num, '*', i, '=', num MULT i)!

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
    TRY num MOD 2 EQUALS 0:
        GIMME TRUE!
    NO???:
        GIMME FALSE!

```

  </td>

  <td>

```python
def is_even(num): 
    if(num % 2 == 0):
        return true
    else:
        return false
```

  </td>

  </tr>
</table>

###  Appending a String to an Array

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
ARR array IS ['Hi', 'I'm', 'Hyper']!
array.push('LOL')!

SAY('element0: ', array[0])!

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


