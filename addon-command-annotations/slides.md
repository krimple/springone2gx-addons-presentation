!SLIDE center

# CLI command annotations

!SLIDE

# Key annotations

* `@CliAvailabilityIndicator` - Is the command (or list of commands) available?
* `@CliCommand` - Expose a command to the shell
* `@CliOption` - Expose command-line options for the given command

!SLIDE

# Example - Command with Parameters #

    @@@java
    @CliCommand(value = "coffeescript addjoinset", ...) 
    public void addJoinSet(

      // one for each option...
      @CliOption(
        key = "joinSetId", 
        mandatory = true, 
        specifiedDefaultValue = "main") String joinSetId,
      
      ...) {

       operations.addJoinSet(joinSetId, ...);
       
    }
    
!SLIDE

# Picking sets of options

    @@@java    
    @CliCommand(value = "say hello", 
       help = "Prints welcome message to the Roo shell")
    public void sayHello(      
      @CliOption(key = "name", 
                 mandatory = true, 
                 help = "State your name") String name, 

      @CliOption(key = "countryOfOrigin", 
                 mandatory = false, 
                 help = "country") Country country) {...}
  
!SLIDE 

# The `Country` enum

    @@@java
    public enum Country {
      AUSTRALIA("Australia"),
      UNITED_STATES("United States"),
      GERMANY("Germany"), ...

      private String countryText;

      private Country(String value) {
          Validate.notBlank(propertyName, 
             "Property name required");
          this.value = value;
      }
      public String toString() {
          return value;
      }
    }

!SLIDE center

# Dynamic attribute fill-in

!SLIDE bullets
# Key Components
* Converters
   * Convert from text in the Roo Shell to Java types, _and_
   * Provides list of possible completion values, based on text entered so far
   * Similar to Spring converters, but not the same

* Target datatypes as Shell `@CliOption` param types
   * Built-in converters selected automatically
   * Your converter must be registered as a `@Component` and `@Service`


!SLIDE

# The Roo Converter interface

    @@@java
    public interface Converter<T> {
      T convertFromText(String value, Class<?> targetType, 
                        String optionContext);

      boolean getAllPossibleValues(
        List<Completion> completions,
        Class<?> targetType,
        String existingData, 
        String optionContext, 
        MethodTarget target);

      boolean supports(Class<?> type, String optionContext);
    }

!SLIDE
.notes This one does not use the option context data

# Built-in - BooleanConverter - `convertFromText`
.notes Makes the input more flexible

    @@@java
    public Boolean convertFromText(
      final String value,
      final Class<?> requiredType, 
      final String optionContext) {

        if ("true".equalsIgnoreCase(value) 
            || "1".equals(value)
            || "yes".equalsIgnoreCase(value)) {
            return true;
        }
        else if ("false".equalsIgnoreCase(value) 
             || "0".equals(value)
             || "no".equalsIgnoreCase(value)) {
            return false;
        }
      ...
!SLIDE

# Dealing with type conversion issues

    @@@java
    ... else {
          throw new IllegalArgumentException(
             "Cannot convert " + value
             + " to type Boolean.");
        }
      }

* Exception will appear as output in the shell


!SLIDE 
# Command Option Context #
.notes Show them
  
    @@@java
    // in @CliOption
    @CliOption(... optionContext = "path-a")
    
    // in converter...
    if (optionContext.equals("path-a")) {
      ... do something
    }
    
* set context with `optionContext` on `@CliOption` 
* converter can distinguish between multiple commands
* may need to convert differently based on the source
    

!SLIDE

# Converters built-in for

* Java Datatypes
  * `BigDecimal`, `BigInteger`, `Boolean`, `Character`, `Date`, `Double`, `Float`, `Integer`, `Long`, `Short`, `String`
* Files
  * The `FileConverter` can do completions based on files in the directory
* Other key converters
  * `Locale`, `Static Fields`, `Enum`
* Available Commands 
  * via `AvailableCommandsConverter`


!SLIDE 

# Example - PgpKeyIdConverter
.notes Shows how a service can be accessed by the converter

    @@@java
    @Component
    @Service
    public class PgpKeyIdConverter 
      implements Converter<PgpKeyId> {

      @Reference 
      private PgpService pgpService;

      public PgpKeyId convertFromText(
              final String value,
              final Class<?> requiredType, 
              final String optionContext) {
          return new PgpKeyId(value.trim());
      }
      ...

!SLIDE

# Example - PgpKeyIdConverter - code fill-in

    @@@java
      public boolean getAllPossibleValues(...) {
        
        for (final PgpKeyId candidate : 
                pgpService.getDiscoveredKeyIds()) {
            final String id = candidate.getId();
            if (id.toUpperCase().startsWith(
              originalUserInput.toUpperCase())) {
                completions.add(new Completion(id));
            }
        }
        return false; // can we dig deeper next time?
    }

* The pgpService is an OSGi Roo service from the add-on

!SLIDE center
# What about the Spring Shell Project?

!SLIDE

# Spring Shell

* A Shell programming interface for your own, Spring-based apps
* NOT OSGi based
* Turns out, you're learning it
* Uses `@CliCommand`, `@CliOption`, shell converters are the same
* Extracted from Spring Roo
* Now you know this too!

