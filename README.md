# HYPER

![Logo](./hyper.jpg)

## Example Programs

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
SAY "HELLO!"!
```

  </td>
  <td>

```python
print('HELLO!')
```

  </td>
  </tr>
</table>


<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
FUNC fibonacci( INT num ): 
    TRY num ISEQUAL 0:
        GIMME 0!
    NO?TRY num ISEQUAL 1 OR num ISEQUAL 2:
        GIMME 1!
    
    SAY fibonacci(num-2) ADD fibonacci(num-1)!
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

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
INT num1 IS 10
INT num2 IS 14
INT num3 IS 12

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

<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
INT num IS 12

LOOKAT i IN range(1,11):
  SAY(num, '*', i, '=', num MULT i)!

```

  </td>

  <td>

```python
num = 12

for i in range (1,11):
  print(num, 'x', i, '=', num*i)
```

  </td>

  </tr>
</table>



<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
ARR arrary!
array IS ['Hi', 'I'm', 'Hyper']!
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


<table>
  <tr>
  <th>HYPER!</th>
  <th>Python</th>
  </tr>

  <tr>
  <td>

```
ARR arrary!
array IS ['Hi', 'I'm', 'Hyper']!
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
